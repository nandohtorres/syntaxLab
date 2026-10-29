"""Trusted lesson checks around Python executed in the browser worker.

This is a learning runner, not a security boundary. The application never sends
learner code to a backend. Developer verification uses authored solutions only.
"""

import ast
import builtins
import contextlib
import importlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
import time


class LimitedOutput(io.StringIO):
    def write(self, value):
        remaining = max(0, 6000 - self.tell())
        super().write(value[:remaining])
        return len(value)


def valid_path(name):
    return (
        isinstance(name, str)
        and len(name) <= 120
        and re.fullmatch(r"[A-Za-z0-9_./-]+", name) is not None
        and all(part not in {"", ".", ".."} for part in name.split("/"))
        and not name.startswith("/")
    )


def grade_request(payload):
    started = time.monotonic()
    request = json.loads(payload) if isinstance(payload, str) else payload
    exercise = request["exercise"]
    files = request.get("files", {})
    entry = exercise.get("entry", "main.py")
    output = LimitedOutput()
    checks = []

    def result(passed, title, message, generated=None):
        return json.dumps({
            "passed": passed, "title": title, "message": message,
            "output": output.getvalue(), "checks": checks,
            "generatedFiles": generated or {}, "exerciseId": exercise["id"],
            "elapsedMs": round((time.monotonic() - started) * 1000),
        })

    if not files or len(files) > 20 or any(
        not valid_path(name) or not isinstance(value, str) for name, value in files.items()
    ):
        return result(False, "Check your workspace", "Use relative file names without .. or empty path segments; up to 20 files.")
    if sum(len(value) for value in files.values()) > 100000:
        return result(False, "Keep this workspace small", "This practice runner supports up to 100,000 characters across your files.")
    if not valid_path(entry) or entry not in files:
        return result(False, "Missing entry file", f"Create {entry} before running this exercise.")
    trees = []
    try:
        for name, source in files.items():
            if name.endswith(".py"):
                trees.append(ast.parse(source, filename=name))
    except SyntaxError as error:
        return result(False, "A small syntax fix", f"{error.filename}, line {error.lineno}: {error.msg}.")
    if not any(tree.body for tree in trees):
        return result(False, "Start with some Python", "Write your solution in the editor, then run it.")
    nodes = {type(node).__name__ for tree in trees for node in ast.walk(tree)}
    for rule in exercise.get("syntax", []):
        if rule.get("unpack"):
            found = any(isinstance(node, ast.Assign)
                        and any(isinstance(target, (ast.Tuple, ast.List)) for target in node.targets)
                        for tree in trees for node in ast.walk(tree))
        elif "call" in rule:
            scope = ([node for tree in trees for node in ast.walk(tree)
                      if isinstance(node, ast.FunctionDef) and node.name == rule["within"]]
                     if rule.get("within") else trees)
            found = any(
                isinstance(node, ast.Call) and (
                    isinstance(node.func, ast.Name) and node.func.id == rule["call"]
                    or isinstance(node.func, ast.Attribute) and node.func.attr == rule["call"]
                )
                for root in scope for node in ast.walk(root)
            )
        else:
            found = bool(nodes.intersection(rule["anyOf"]))
        checks.append({"label": rule["label"], "passed": found})
        if not found:
            return result(False, "Practice the intended syntax", rule.get("message", rule["label"]))

    run_root = Path(tempfile.mkdtemp(prefix="synlab-attempt-"))
    previous_cwd = os.getcwd()
    previous_path = list(sys.path)
    previous_argv = list(sys.argv)
    previous_modules = set(sys.modules)
    namespace = {"__name__": "__main__", "__builtins__": dict(vars(builtins))}
    try:
        for name, content in files.items():
            target = run_root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
        os.chdir(run_root)
        sys.path.insert(0, str(run_root))
        sys.argv = [entry, *exercise.get("argv", [])]
        importlib.invalidate_caches()
        namespace["__file__"] = str(run_root / entry)
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(output):
            if exercise.get("structures"):
                exec(request.get("sharedSetup", ""), namespace)
            exec(exercise.get("setup", ""), namespace)
            exec(compile(files[entry], entry, "exec"), namespace)
            namespace["_stdout"] = output.getvalue()
            for check in exercise["checks"]:
                try:
                    exec(check["code"], namespace)
                    checks.append({"label": check["label"], "passed": True})
                except BaseException as error:
                    detail = str(error)[:300] or "The result did not match this check."
                    checks.append({"label": check["label"], "passed": False, "message": detail})
        generated = {}
        for target in run_root.rglob("*"):
            if target.is_file() and not target.is_symlink() and target.suffix in {".py", ".txt", ".json", ".csv", ".log"}:
                if target.stat().st_size <= 16000 and len(generated) < 20:
                    name = target.relative_to(run_root).as_posix()
                    text = target.read_text(encoding="utf-8", errors="replace")
                    if text != files.get(name):
                        generated[name] = text
        failed = [check for check in checks if not check["passed"]]
        if failed:
            first = failed[0]
            return result(False, "One more adjustment", f"{first['label']}: {first.get('message', 'check this step')}", generated)
        return result(True, "That works. Nice rep.", exercise.get("takeaway", "Your code passed the checks. Try a fresh variation next."), generated)
    except BaseException as error:
        return result(False, "Python found an error", f"{type(error).__name__}: {str(error)[:300]}")
    finally:
        os.chdir(previous_cwd)
        sys.path[:] = previous_path
        sys.argv[:] = previous_argv
        for name in set(sys.modules) - previous_modules:
            module_path = getattr(sys.modules[name], "__file__", None)
            if module_path and Path(module_path).is_relative_to(run_root):
                sys.modules.pop(name, None)
        importlib.invalidate_caches()
        # This is only the fresh per-attempt virtual directory created above.
        if run_root.parent.resolve() == Path(tempfile.gettempdir()).resolve():
            shutil.rmtree(run_root, ignore_errors=True)

