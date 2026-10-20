/* global self */
const base = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
let check

async function initialize() {
  const { loadPyodide } = await import(/* @vite-ignore */ `${base}pyodide.mjs`)
  const python = await loadPyodide({ indexURL: base })
  check = python.runPython(`
import ast
import contextlib
import io
import json

def check_first_rep(source):
    def result(passed, title, message, output="", checks=None):
        return json.dumps(dict(passed=passed, title=title, message=message,
                               output=output, checks=checks or []))
    try:
        tree = ast.parse(source, filename="main.py")
    except SyntaxError as error:
        return result(False, "A small syntax fix", f"Line {error.lineno}: {error.msg}. Try writing a name, an equals sign, and a value.")
    if not tree.body:
        return result(False, "Start with one line", "Create a variable called retries and give it the integer 3.")
    if any(isinstance(node, ast.Compare) for node in ast.walk(tree)) and not any(isinstance(node, (ast.Assign, ast.AnnAssign)) for node in tree.body):
        return result(False, "Use assignment here", "= assigns a value. == compares two values. Create retries with a single equals sign.")
    namespace = {"__name__": "__main__"}
    output = io.StringIO()
    try:
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(output):
            exec(compile(tree, "main.py", "exec"), namespace)
    except Exception as error:
        return result(False, "Python found an error", f"{type(error).__name__}: {str(error)[:240]}", output.getvalue()[:1000])
    exists = "retries" in namespace
    value = namespace.get("retries")
    integer = type(value) is int
    correct = integer and value == 3
    checks = [dict(label="Variable named retries", passed=exists),
              dict(label="Integer value", passed=exists and integer),
              dict(label="Value equals 3", passed=correct)]
    if not exists:
        return result(False, "Check the variable name", "Use the exact name retries. Printing 3 alone doesn't create that variable.", output.getvalue()[:1000], checks)
    if not integer:
        return result(False, "Use a number, not text", "Give retries the integer 3, without quotation marks. True and 3.0 are different types too.", output.getvalue()[:1000], checks)
    if not correct:
        return result(False, "Almost. Check the value", "The variable is there. Set its value to 3, then run your code again.", output.getvalue()[:1000], checks)
    return result(True, "That's it. You wrote Python.", "You created retries and assigned it the integer 3. No print statement needed.", output.getvalue()[:1000], checks)

check_first_rep
`)
  self.postMessage({ type: 'ready' })
}

initialize().catch(() => self.postMessage({ type: 'load-error' }))
self.onmessage = ({ data }) => {
  if (data.type !== 'run' || !check) return
  try {
    self.postMessage({ type: 'result', id: data.id, result: JSON.parse(check(data.code)) })
  } catch {
    self.postMessage({ type: 'run-error', id: data.id })
  }
}
