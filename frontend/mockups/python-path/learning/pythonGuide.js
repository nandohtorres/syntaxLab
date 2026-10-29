const intro = 'https://docs.python.org/3.12/tutorial/introduction.html'
const types = 'https://docs.python.org/3.12/library/stdtypes.html'
const flow = 'https://docs.python.org/3.12/tutorial/controlflow.html'
const structures = 'https://docs.python.org/3.12/tutorial/datastructures.html'
const classes = 'https://docs.python.org/3.12/tutorial/classes.html'
const topic = (id, title, group, summary, code, output, remember, source) => ({ id, title, group, summary, code, output, remember, source })

export const pythonTopics = [
  topic('variables', 'Create a variable', 'Start here', 'Give a value a name with =. Use that name wherever you need the value.',
    'name = "Maya"\nscore = 10\nscore = score + 2\nprint(name, score)', 'Maya 12', '= assigns a value. == compares two values.', intro),
  topic('types', 'Know your basic types', 'Start here', 'Numbers, text, booleans and missing values have different types. You do not need a type declaration to create them.',
    'count = 3          # int\nprice = 2.5        # float\nname = "Maya"      # str\nready = True       # bool\nresult = None\nprint(type(count).__name__, ready)', 'int True', 'True, False and None start with capital letters.', types),
  topic('numbers', 'Work with numbers', 'Start here', 'Use arithmetic operators to calculate values. Parentheses control the order.',
    'print(7 / 2)\nprint(7 // 2)\nprint(7 % 2)\nprint(2 ** 3)', '3.5\n3\n1\n8', '/ divides, // floors, % finds the remainder, and ** raises a power.', intro),
  topic('strings', 'Create and format strings', 'Start here', 'Put text in quotes. An f-string inserts values into your text.',
    'name = "Maya"\nmessage = f"Hi, {name}!"\nprint(message)\nprint(name[0], name[-1])\nprint(name[:2])', 'Hi, Maya!\nM a\nMa', 'Indexing starts at zero. A slice excludes its ending index.', intro),
  topic('lists', 'Build a list', 'Start here', 'A list keeps items in order and lets you change them.',
    'scores = [4, 7]\nscores.append(9)\nscores[0] = 5\nprint(scores)\nprint(scores[-1])', '[5, 7, 9]\n9', 'Use square brackets. append changes the list in place.', structures),
  topic('tuples', 'Group values in a tuple', 'Start here', 'A tuple holds an ordered group whose item references cannot be reassigned.',
    'point = (3, 5)\nx, y = point\nprint(x, y)\nsingle = (3,)\nprint(len(single))', '3 5\n1', 'A one-item tuple needs a comma: (3,).', types),
  topic('dictionaries', 'Look things up with a dictionary', 'Start here', 'A dictionary connects keys to values. Use a key to read or update its value.',
    'user = {"name": "Maya", "level": 1}\nuser["level"] = 2\nprint(user["name"])\nprint(user.get("score", 0))', 'Maya\n0', 'get(key, default) supplies a fallback when the key is missing.', structures),
  topic('sets', 'Keep unique values with a set', 'Start here', 'A set removes duplicates and supports membership checks.',
    'seen = {2, 2, 5}\nseen.add(7)\nprint(len(seen))\nprint(5 in seen)', '3\nTrue', 'set() creates an empty set. {} creates a dictionary.', structures),
  topic('conditions', 'Make a decision', 'Control the flow', 'Use if, elif and else to choose which block runs.',
    'score = 8\nif score >= 7:\n    print("Pass")\nelse:\n    print("Try again")', 'Pass', 'A colon starts a block. Indent its body consistently, usually four spaces.', flow),
  topic('for-loops', 'Loop over items', 'Control the flow', 'A for loop visits items one at a time. enumerate gives you each index too.',
    'colors = ["mint", "blue"]\nfor index, color in enumerate(colors):\n    print(index, color)', '0 mint\n1 blue', 'range(3) produces 0, 1, 2 when you loop over it.', flow),
  topic('while-loops', 'Repeat while a condition holds', 'Control the flow', 'A while loop repeats until its condition becomes false.',
    'remaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining -= 1', '3\n2\n1', 'Change the state so your loop can eventually stop.', flow),
  topic('functions', 'Write a function', 'Reusable code', 'Define a function with def. Parameters receive inputs; return sends a result back.',
    'def add_tax(price, rate=0.1):\n    return price * (1 + rate)\n\nprint(round(add_tax(10), 2))', '11.0', 'print displays a value. return gives a value back to the caller.', flow),
  topic('methods', 'Call a method', 'Reusable code', 'A method is an operation accessed through an object. A standalone function is called by its name.',
    'word = "python"\nprint(word.upper())  # method\nprint(len(word))     # function\nprint(word)', 'PYTHON\n6\npython', 'String methods return new strings; the original string stays unchanged.', types),
  topic('comprehensions', 'Build a list in one expression', 'Go a little further', 'A comprehension transforms items, optionally keeping only those that match a condition.',
    'numbers = [1, 2, 3, 4]\nsquares = [n * n for n in numbers if n % 2 == 0]\nprint(squares)', '[4, 16]', 'Use a normal loop when it makes the steps easier to read.', structures),
  topic('references', 'Understand shared lists', 'Go a little further', 'Two names can refer to the same mutable object. Copy the list when you need a separate outer list.',
    'original = [1, 2]\nshared = original\nseparate = original.copy()\nshared.append(3)\nprint(original)\nprint(separate)', '[1, 2, 3]\n[1, 2]', 'copy() is shallow: nested objects can still be shared.', classes),
  topic('exceptions', 'Handle a specific error', 'Go a little further', 'Use try and except when an operation can fail in a way you know how to handle.',
    'try:\n    number = int("hello")\nexcept ValueError:\n    print("Use a whole number")', 'Use a whole number', 'Catch the error you expect instead of hiding every failure.', 'https://docs.python.org/3.12/tutorial/errors.html'),
  topic('classes', 'Create a small class', 'Go a little further', 'A class groups state and behavior. self refers to the current instance.',
    'class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def increment(self):\n        self.value += 1\n\ncounter = Counter()\ncounter.increment()\nprint(counter.value)', '1', '__init__ sets up a new instance.', classes),
  topic('imports', 'Use a module', 'Go a little further', 'Import a module to use code already provided by Python or another package.',
    'import math\n\nprint(math.isqrt(20))\nprint(math.pi > 3)', '4\nTrue', 'A module is a reusable unit of Python code.', 'https://docs.python.org/3.12/tutorial/modules.html'),
  topic('recursion', 'Let a function call itself', 'Go a little further', 'Recursion solves a smaller version of a problem, stopping at a base case.',
    'def countdown(n):\n    if n == 0:\n        return []\n    return [n] + countdown(n - 1)\n\nprint(countdown(3))', '[3, 2, 1]', 'Every call must move toward a stopping case. Python limits recursion depth.', classes),
  topic('generators', 'Yield one value at a time', 'Go a little further', 'A generator pauses at yield and resumes when you ask for its next value.',
    'def steps():\n    yield "start"\n    yield "finish"\n\nfor step in steps():\n    print(step)', 'start\nfinish', 'A generator is consumed as you iterate; it is not a reusable list.', classes),
  topic('collections', 'Use helpful collection tools', 'Go a little further', 'Counter counts items. deque supports efficient work at either end of a queue.',
    'from collections import Counter, deque\n\ncounts = Counter("banana")\nqueue = deque(["first", "second"])\nprint(counts["a"])\nprint(queue.popleft())', '3\nfirst', 'Use deque.popleft() for a queue instead of repeatedly removing list index zero.', 'https://docs.python.org/3.12/library/collections.html'),
]

export const pythonQuirks = [
  { id: 'range-stop', title: 'range() stops before the end', text: 'range(3) starts counting at zero and stops before 3, giving you three numbers: 0, 1 and 2. The stop value is a boundary, not a number to include.', code: 'print(list(range(3)))', output: '[0, 1, 2]', source: flow },
  { id: 'append-return', title: 'append() returns None', text: 'append adds an item directly to the existing list. It returns None, meaning no result value is supplied. Keep using the list; assigning items = items.append(2) would replace your list variable with None.', code: 'items = [1]\nresult = items.append(2)\nprint(items, result)', output: '[1, 2] None', source: types },
  { id: 'empty-set', title: 'Empty braces make a dictionary', text: 'Dictionaries store key-value pairs; sets store unique values. Although both can use braces, {} always creates an empty dictionary. Use set() when you want an empty set you can add values to.', code: 'print(type({}).__name__)\nprint(type(set()).__name__)', output: 'dict\nset', source: structures },
  { id: 'comparison', title: 'Same values or the same object?', text: '== asks whether values are equal. is asks whether two names refer to the very same object. These lists contain equal values but are separate objects. Use == for value comparisons and is None to check for None.', code: 'first = [1]\nsecond = [1]\nprint(first == second)\nprint(first is second)', output: 'True\nFalse', source: types },
]

export const pythonFacts = [
  { title: 'Meet Python', text: 'Python is a general-purpose language with readable syntax, useful for small scripts and larger applications.', source: 'https://docs.python.org/3.12/faq/general.html#what-is-python' },
  { title: 'A name with a punchline', text: 'Python was named after the comedy series Monty Python, rather than the snake.', source: 'https://docs.python.org/3.12/faq/general.html#why-is-it-called-python' },
  { title: 'Small scripts, big uses', text: 'Python is used for automation, web services, data work and scientific computing.', source: 'https://www.python.org/about/apps/' },
  { title: 'Whitespace does real work', text: 'Indentation defines code blocks, so layout is part of the language.', source: flow },
]
