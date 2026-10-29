"""Run the authored Blind 75 and its internal preparation steps."""
import importlib.util
import json
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('runner', root / 'runner.py')
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
tempfile.tempdir = str(root / '.cache')
items = json.loads((root / '.cache/blind75-practice.json').read_text(encoding='utf-8'))
setup = (root / 'content/structures.py').read_text(encoding='utf-8')
for item in items:
    result = json.loads(runner.grade_request({'exercise': item, 'files': item['solutionFiles'], 'sharedSetup': setup}))
    assert result['passed'], (item['id'], result)
    starter = json.loads(runner.grade_request({'exercise': item, 'files': item['initialFiles'], 'sharedSetup': setup}))
    assert not starter['passed'], item['id']
print(f'{len(items)} reference solutions passed; all starters rejected (75 full questions plus {len(items) - 75} preparation steps).')
