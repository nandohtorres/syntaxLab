"""Verify the exact output of the authored read-only Python examples."""
import contextlib
import io
import json
from pathlib import Path

examples = json.loads((Path(__file__).resolve().parents[1] / '.cache/hub-python-examples.json').read_text(encoding='utf-8'))
for example in examples:
    stream = io.StringIO()
    with contextlib.redirect_stdout(stream):
        exec(compile(example['code'], f"learning-hub/{example['id']}.py", 'exec'), {})
    assert stream.getvalue().rstrip() == example['output'].rstrip(), (example['id'], stream.getvalue(), example['output'])
print(f'Learning Hub: all {len(examples)} authored Python examples match their displayed output.')
