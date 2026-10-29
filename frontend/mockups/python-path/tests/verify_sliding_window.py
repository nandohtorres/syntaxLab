"""Execute authored sample solutions and representative incorrect implementations."""
import importlib.util
import json
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('runner', root / 'runner.py')
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
tempfile.tempdir = str(root / '.cache')
sample = json.loads((root / '.cache/sliding-window-lessons.json').read_text(encoding='utf-8'))

def grade(exercise, files):
    return json.loads(runner.grade_request({'exercise': exercise, 'files': files}))

checks = 0
for exercise in sample:
    result = grade(exercise, exercise['solutionFiles'])
    assert result['passed'], (exercise['id'], result)
    assert not grade(exercise, exercise['initialFiles'])['passed'], exercise['id']
    checks += len(result['checks'])

mutations = [
    (0, 'window = values[:k]', 'window = values[:k - 1]'),
    (1, 'total - values[left] + values[incoming]', 'total + values[incoming]'),
    (2, 'best = total', 'best = 0'),
    (3, 'while counts[text[right]] > 1:', 'if counts[text[right]] > 1:'),
    (4, 'while counts[char] > 1:', 'if counts[char] > 1:'),
    (5, 'while len(counts) > k:', 'while counts[char] > 1:'),
]
for index, original, wrong in mutations:
    exercise = sample[index]
    source = exercise['solutionFiles']['main.py']
    assert original in source
    assert not grade(exercise, {'main.py': source.replace(original, wrong)})['passed'], (exercise['id'], wrong)
print(f'Sliding Window: {len(sample)} solutions passed {checks} checks; all starters and {len(mutations)} incorrect implementations rejected.')
