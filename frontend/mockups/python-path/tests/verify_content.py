"""Run only repository-authored reference solutions, never learner submissions."""
import importlib.util
import json
from pathlib import Path
import tempfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("lesson_runner", ROOT / "runner.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
tempfile.tempdir = str(ROOT / ".cache")
lessons = json.loads((ROOT / ".cache/lessons.json").read_text(encoding="utf-8"))
setup = (ROOT / "content/structures.py").read_text(encoding="utf-8")
failures = []
checks = 0
for exercise in lessons:
    result = json.loads(runner.grade_request({
        "exercise": exercise, "files": exercise["solutionFiles"], "sharedSetup": setup,
    }))
    checks += len(result["checks"])
    if not result["passed"]:
        failures.append({"id": exercise["id"], "title": exercise["title"], "result": result})
    starter = json.loads(runner.grade_request({
        "exercise": exercise, "files": exercise["initialFiles"], "sharedSetup": setup,
    }))
    if starter["passed"]:
        failures.append({"id": exercise["id"], "error": "Starter already passes"})
report = {"lessons": len(lessons), "reference_checks": checks, "failures": failures}
(ROOT / ".cache/content-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
for failure in failures:
    print(failure)
print(f"Authored reference solutions: {len(lessons)-len(failures)}/{len(lessons)}; checks: {checks}")
raise SystemExit(bool(failures))
