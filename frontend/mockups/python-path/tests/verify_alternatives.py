"""Check alternate valid answers and plausible mistakes against authored lessons."""
import json
from pathlib import Path
import runpy

root = Path(__file__).resolve().parents[1]
runner = runpy.run_path(str(root / 'runner.py'))['grade_request']
lessons = {item['id']: item for item in json.loads((root / '.cache/lessons.json').read_text(encoding='utf-8'))}
cases = [
    ('reassign', 'count = 3\ncount = count + 2', True),
    ('reassign', 'count = 3\ncount += 2', True),
    ('reassign', 'count = 3\ncount -= -2', True),
    ('reassign', 'count = 5', False),
    ('reassign', 'count = 3\ncount += 1', False),
    ('assign', 'retries: int = 3', True),
    ('assign', 'retries = "3"', False),
    ('assign', 'retries = 3.0', False),
    ('assign', 'retries = True', False),
    ('string', "region = 'us-east-1'", True),
    ('string', 'region = "us-east-1"', True),
    ('string-v1', 'city = "Dallas"', True),
    ('string-v1', 'city = 1', False),
    ('boolean-v1', 'ready = False', True),
    ('boolean-v1', 'ready = 0', False),
    ('boolean-v1', 'ready = "False"', False),
    ('float-v2', 'duration = 0.75', True),
    ('float-v2', 'duration = "0.75"', False),
    ('none-v1', 'result = None', True),
    ('none-v1', 'result = "None"', False),
    ('print', 'print("Hello, Python!")', True),
    ('print', 'import sys\nsys.stdout.write("Hello, Python!")', False),
    ('boolean-logic', 'ready = True\nerrors = 0\ncan_run = ready and errors == 0', True),
    ('boolean-logic', 'can_run = True', False),
    ('comprehension', 'squares = [0, 4, 16]', False),
    ('comprehension', 'squares = [n*n for n in range(6) if n % 2 == 0]', True),
    ('tuple', 'point = (1, 4)', True),
    ('tuple', 'point = [1, 4]', False),
    ('unpack', 'point = (3, 5)\nx, y = point', True),
    ('unpack', 'point = (3, 5)\n[x, y] = point', True),
    ('unpack', 'point = (3, 5)\nx = 3\ny = 5', False),
    ('helper', 'def square(n): return n*n\ndef sum_squares(a,b): return square(a)+square(b)', True),
    ('helper', 'def square(n): return n*n\ndef sum_squares(a,b): return a*a+b*b', False),
    ('break', 'values=[3,-1,7,-2]\nfirst_negative=None\nfor value in values:\n    if value < 0:\n        first_negative=value\n        break', True),
    ('break', 'first_negative = -1', False),
]
for identifier, source, expected in cases:
    result = json.loads(runner({'exercise': lessons[identifier], 'files': {'main.py': source}}))
    assert result['passed'] is expected, (identifier, source, result)
print(f'Alternate answers and negative controls: {len(cases)}/{len(cases)} passed')

for helper, expected in [
    ('def double(n):\n    return n*2\n', False),
    ('def double(n):\n    return n*2\nif __name__ == "__main__":\n    print("script")\n', True),
]:
    result = json.loads(runner({'exercise': lessons['main-guard'], 'files': {
        'main.py': 'from helpers import double\nanswer=double(4)', 'helpers.py': helper,
    }}))
    assert result['passed'] is expected, ('main-guard direct execution', result)
print('Main-guard import/direct-execution regression: 2/2 passed')

setup = (root / 'content/structures.py').read_text(encoding='utf-8')
algorithm_controls = [
    ('b75-347', 'from collections import Counter\nclass Solution:\n    def topKFrequent(self,nums,k):\n        result=[value for value,count in Counter(nums).most_common(k)]\n        return result+[result[0]]', False),
    ('b75-191', 'class Solution:\n    def hammingWeight(self,n):\n        return float(n.bit_count())', False),
    ('b75-217', 'class Solution:\n    def containsDuplicate(self,nums):\n        return int(len(nums)!=len(set(nums)))', False),
    ('b75-1', 'class Solution:\n    def twoSum(self,nums,target):\n        for i,a in enumerate(nums):\n            for j in range(i+1,len(nums)):\n                if a+nums[j]==target: return [i,j]', True),
]
for identifier, source, expected in algorithm_controls:
    result = json.loads(runner({'exercise': lessons[identifier], 'files': {'main.py': source}, 'sharedSetup': setup}))
    assert result['passed'] is expected, (identifier, source, result)
print('Blind 75 duplicate/type negative controls and alternate valid answer: 4/4 passed')
