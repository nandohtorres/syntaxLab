// Rapid Fire: 20 concepts, three reps each, grouped into three levels. Every rep adds to
// one growing program, so later reps can use names created earlier. `check` runs after
// the program; `data` is how the names it sets look afterwards (shown as data bubbles);
// `tip` is a one-line Python fact about the syntax that rep practices.
const levels = [
  { id: '1', title: 'Storing data', concepts: [
    { concept: 'Numbers', reps: [
      { task: 'Set x to the whole number 5', code: 'x = 5', check: 'assert x == 5', data: { x: '5' }, tip: '= stores a value; == compares two values.' },
      { task: 'Set y to the decimal number 10.5', code: 'y = 10.5', check: 'assert y == 10.5', data: { y: '10.5' }, tip: 'Any number with a decimal point is a float, even 10.0.' },
      { task: 'Set z to negative 3', code: 'z = -3', check: 'assert z == -3', data: { z: '-3' }, tip: 'Python ints have no size limit: 10 ** 100 works fine.' },
    ] },
    { concept: 'Strings', reps: [
      { task: 'Set name to the text "Ada"', code: 'name = "Ada"', check: 'assert name == "Ada"', data: { name: '"Ada"' }, tip: 'Single or double quotes both work; just open and close with the same one.' },
      { task: 'Set car to the text "Chevy"', code: 'car = "Chevy"', check: 'assert car == "Chevy"', data: { car: '"Chevy"' }, tip: 'Strings are immutable: car.upper() returns a new string and leaves car alone.' },
      { task: 'Set city to the text "Dallas"', code: 'city = "Dallas"', check: 'assert city == "Dallas"', data: { city: '"Dallas"' }, tip: 'Strings index like lists: city[0] is "D" and city[-1] is "s".' },
    ] },
    { concept: 'Math', reps: [
      { task: 'Set total to x plus 10', code: 'total = x + 10', check: 'assert total == 15', data: { total: '15' }, tip: 'x += 10 is shorthand for x = x + 10.' },
      { task: 'Set half to y divided by 2', code: 'half = y / 2', check: 'assert half == 5.25', data: { half: '5.25' }, tip: '/ always gives a float; // drops the remainder: 7 // 2 is 3.' },
      { task: 'Set area to x times x', code: 'area = x * x', check: 'assert area == 25', data: { area: '25' }, tip: '** is power: x ** 2 is the same as x * x.' },
    ] },
    { concept: 'Joining strings', reps: [
      { task: 'Use + to join "Hello " and name into greeting', code: 'greeting = "Hello " + name', check: 'assert greeting == "Hello Ada"', data: { greeting: '"Hello Ada"' }, tip: '+ only joins text to text: "Age " + 30 raises a TypeError.' },
      { task: 'Use + to join "My car is a " and car into ride', code: 'ride = "My car is a " + car', check: 'assert ride == "My car is a Chevy"', data: { ride: '"My car is a Chevy"' }, tip: 'Wrap a number in str() to join it: "Year " + str(2020).' },
      { task: 'Use + to join city and ", TX" into home', code: 'home = city + ", TX"', check: 'assert home == "Dallas, TX"', data: { home: '"Dallas, TX"' }, tip: '* repeats a string: "ab" * 3 is "ababab".' },
    ] },
    { concept: 'f-strings', reps: [
      { task: 'Use an f-string with name to set msg to "Hi Ada"', code: 'msg = f"Hi {name}"', check: 'assert msg == "Hi Ada"', data: { msg: '"Hi Ada"' }, tip: 'Put f right before the quote; any expression can go inside {}.' },
      { task: 'Use an f-string with name and car to set about to "Ada drives a Chevy"', code: 'about = f"{name} drives a {car}"', check: 'assert about == "Ada drives a Chevy"', data: { about: '"Ada drives a Chevy"' }, tip: 'One f-string can hold as many {} values as you need.' },
      { task: 'Use an f-string with city and x to set info to "Dallas has 5 parks"', code: 'info = f"{city} has {x} parks"', check: 'assert info == "Dallas has 5 parks"', data: { info: '"Dallas has 5 parks"' }, tip: 'f-strings convert numbers for you, so {x} needs no str().' },
    ] },
    { concept: 'Lists', reps: [
      { task: 'Set nums to a list of 1, 2, 3', code: 'nums = [1, 2, 3]', check: 'assert nums == [1, 2, 3]', data: { nums: '[1, 2, 3]' }, tip: 'Lists keep their order and can be changed after you make them.' },
      { task: 'Set cars to a list of "Chevy" and "Ford"', code: 'cars = ["Chevy", "Ford"]', check: 'assert cars == ["Chevy", "Ford"]', data: { cars: '["Chevy", "Ford"]' }, tip: 'A list can mix types: [1, "two", 3.0] is valid.' },
      { task: 'Set scores to a list of 90, 85, 77', code: 'scores = [90, 85, 77]', check: 'assert scores == [90, 85, 77]', data: { scores: '[90, 85, 77]' }, tip: 'Square brackets make a list; an empty one is just [].' },
    ] },
    { concept: 'Dictionaries', reps: [
      { task: 'Set person to a dict: "name" is name, "age" is 30', code: 'person = {"name": name, "age": 30}', check: 'assert person == {"name": "Ada", "age": 30}', data: { person: '{"name": "Ada", "age": 30}' }, tip: 'A dict maps keys to values, and each key can appear only once.' },
      { task: 'Set ride_info to a dict: "make" is car, "year" is 2020', code: 'ride_info = {"make": car, "year": 2020}', check: 'assert ride_info == {"make": "Chevy", "year": 2020}', data: { ride_info: '{"make": "Chevy", "year": 2020}' }, tip: 'Dict keys must be unchangeable types like str or int; a list cannot be a key.' },
      { task: 'Set prices to a dict: "apple" is 1.5, "bread" is 3', code: 'prices = {"apple": 1.5, "bread": 3}', check: 'assert prices == {"apple": 1.5, "bread": 3}', data: { prices: '{"apple": 1.5, "bread": 3}' }, tip: 'Dicts remember the order you added keys (Python 3.7+).' },
    ] },
  ] },
  { id: '2', title: 'Using data', concepts: [
    { concept: 'Append', reps: [
      { task: 'Append 4 to the end of nums', code: 'nums.append(4)', check: 'assert nums == [1, 2, 3, 4]', data: { nums: '[1, 2, 3, 4]' }, tip: 'append changes the list itself and returns None, so never write nums = nums.append(4).' },
      { task: 'Append "Tesla" to the end of cars', code: 'cars.append("Tesla")', check: 'assert cars == ["Chevy", "Ford", "Tesla"]', data: { cars: '["Chevy", "Ford", "Tesla"]' }, tip: 'append adds one item; extend adds every item from another list.' },
      { task: 'Append 100 to the end of scores', code: 'scores.append(100)', check: 'assert scores == [90, 85, 77, 100]', data: { scores: '[90, 85, 77, 100]' }, tip: 'Use insert(0, value) to add to the front instead of the end.' },
    ] },
    { concept: 'Indexing', reps: [
      { task: 'Set first to the first item of nums (index 0)', code: 'first = nums[0]', check: 'assert first == 1', data: { first: '1' }, tip: 'Indexes start at 0, so the first item is [0].' },
      { task: 'Set last_car to the last item of cars (index -1)', code: 'last_car = cars[-1]', check: 'assert last_car == "Tesla"', data: { last_car: '"Tesla"' }, tip: 'Negative indexes count from the end: [-1] is last, [-2] is second to last.' },
      { task: 'Set second to the second item of scores (index 1)', code: 'second = scores[1]', check: 'assert second == 85', data: { second: '85' }, tip: 'Slices take a range: scores[1:3] gets items 1 and 2, but not 3.' },
    ] },
    { concept: 'len()', reps: [
      { task: 'Set count to the length of nums', code: 'count = len(nums)', check: 'assert count == 4', data: { count: '4' }, tip: 'len() works on lists, strings, dicts, tuples and sets.' },
      { task: 'Set car_count to the length of cars', code: 'car_count = len(cars)', check: 'assert car_count == 3', data: { car_count: '3' }, tip: 'The last valid index is always len(cars) - 1.' },
      { task: 'Set name_len to the length of name', code: 'name_len = len(name)', check: 'assert name_len == 3', data: { name_len: '3' }, tip: 'On a string, len() counts every character, spaces included.' },
    ] },
    { concept: 'Dict access', reps: [
      { task: 'Set age to the "age" value in person', code: 'age = person["age"]', check: 'assert age == 30', data: { age: '30' }, tip: 'person["email"] raises a KeyError when the key is missing.' },
      { task: 'Set year to the "year" value in ride_info', code: 'year = ride_info["year"]', check: 'assert year == 2020', data: { year: '2020' }, tip: 'ride_info.get("color") returns None instead of raising an error.' },
      { task: 'Add the key "milk" to prices with the value 4', code: 'prices["milk"] = 4', check: 'assert prices["milk"] == 4', data: { prices: '{"apple": 1.5, "bread": 3, "milk": 4}' }, tip: 'Assigning to a new key adds it; assigning to an existing key replaces its value.' },
    ] },
    { concept: 'Comparisons', reps: [
      { task: 'Set is_adult to True or False: is age 18 or more?', code: 'is_adult = age >= 18', check: 'assert is_adult is True', data: { is_adult: 'True' }, tip: 'A comparison always gives a bool: True or False.' },
      { task: 'Set is_new to True or False: is year more than 2022?', code: 'is_new = year > 2022', check: 'assert is_new is False', data: { is_new: 'False' }, tip: 'Comparisons can chain: 18 <= age < 65 checks both sides at once.' },
      { task: 'Set same to True or False: is x equal to 5?', code: 'same = x == 5', check: 'assert same is True', data: { same: 'True' }, tip: 'Use == to compare values; keep is for None checks, like x is None.' },
    ] },
    { concept: 'if / else', reps: [
      { task: 'If is_adult, set status to "adult", else "minor"', code: 'if is_adult:\n    status = "adult"\nelse:\n    status = "minor"', check: 'assert status == "adult"', data: { status: '"adult"' }, tip: 'The colon opens a block; every line indented under it belongs to it.' },
      { task: 'If year > 2018, set label to "recent", else "old"', code: 'if year > 2018:\n    label = "recent"\nelse:\n    label = "old"', check: 'assert label == "recent"', data: { label: '"recent"' }, tip: 'One-line version: label = "recent" if year > 2018 else "old".' },
      { task: 'If x > 10 set size to "big", elif x > 3 "medium", else "small"', code: 'if x > 10:\n    size = "big"\nelif x > 3:\n    size = "medium"\nelse:\n    size = "small"', check: 'assert size == "medium"', data: { size: '"medium"' }, tip: 'elif only runs when every condition above it was False.' },
    ] },
  ] },
  { id: '3', title: 'Logic and functions', concepts: [
    { concept: 'for loops', reps: [
      { task: 'Start doubled as an empty list, then loop over nums appending n * 2', code: 'doubled = []\nfor n in nums:\n    doubled.append(n * 2)', check: 'assert doubled == [2, 4, 6, 8]', data: { doubled: '[2, 4, 6, 8]' }, tip: 'A for loop hands you each item directly, so you rarely need an index.' },
      { task: 'Start total_score at 0, then loop over scores adding each s', code: 'total_score = 0\nfor s in scores:\n    total_score += s', check: 'assert total_score == 352', data: { total_score: '352' }, tip: 'sum(scores) does this whole loop in one call.' },
      { task: 'Start count_up as an empty list, then loop i over range(3) appending i', code: 'count_up = []\nfor i in range(3):\n    count_up.append(i)', check: 'assert count_up == [0, 1, 2]', data: { count_up: '[0, 1, 2]' }, tip: 'range(3) gives 0, 1, 2; it stops before the number you pass.' },
    ] },
    { concept: 'List comprehensions', reps: [
      { task: 'Use a comprehension to set squares to n * n for each n in nums', code: 'squares = [n * n for n in nums]', check: 'assert squares == [1, 4, 9, 16]', data: { squares: '[1, 4, 9, 16]' }, tip: '[expression for item in list] builds a new list in one line.' },
      { task: 'Use a comprehension to set upper_cars to c.upper() for each c in cars', code: 'upper_cars = [c.upper() for c in cars]', check: 'assert upper_cars == ["CHEVY", "FORD", "TESLA"]', data: { upper_cars: '["CHEVY", "FORD", "TESLA"]' }, tip: 'The loop name (c here) only exists inside the comprehension.' },
      { task: 'Use a comprehension to set evens to each n in nums where n % 2 == 0', code: 'evens = [n for n in nums if n % 2 == 0]', check: 'assert evens == [2, 4]', data: { evens: '[2, 4]' }, tip: 'An if at the end filters: only items where it is True are kept.' },
    ] },
    { concept: 'Functions', reps: [
      { task: 'Define add(a, b) that returns a + b', code: 'def add(a, b):\n    return a + b', check: 'assert add(2, 3) == 5', data: { add: 'def add(a, b)' }, tip: 'def defines a function; return sends a value back to whoever called it.' },
      { task: 'Define shout(text) that returns text.upper() + "!"', code: 'def shout(text):\n    return text.upper() + "!"', check: 'assert shout("hi") == "HI!"', data: { shout: 'def shout(text)' }, tip: 'A function without a return statement returns None.' },
      { task: 'Define is_even(n) that returns n % 2 == 0', code: 'def is_even(n):\n    return n % 2 == 0', check: 'assert is_even(4) is True and is_even(3) is False', data: { is_even: 'def is_even(n)' }, tip: '% gives the remainder, so n % 2 == 0 means n is even.' },
    ] },
    { concept: 'Calling functions', reps: [
      { task: 'Call add with 2 and 3, store the answer in result', code: 'result = add(2, 3)', check: 'assert result == 5', data: { result: '5' }, tip: 'Parentheses run a function: add is the function, add(2, 3) calls it.' },
      { task: 'Call shout with name, store the answer in loud', code: 'loud = shout(name)', check: 'assert loud == "ADA!"', data: { loud: '"ADA!"' }, tip: 'Any variable can be an argument, not just typed-in values.' },
      { task: 'Call is_even with 10, store the answer in check', code: 'check = is_even(10)', check: 'assert check is True', data: { check: 'True' }, tip: 'Functions that answer yes or no are usually named is_ or has_.' },
    ] },
    { concept: 'Default arguments', reps: [
      { task: 'Define greet(who="World") that returns f"Hello {who}"', code: 'def greet(who="World"):\n    return f"Hello {who}"', check: 'assert greet() == "Hello World" and greet("Ada") == "Hello Ada"', data: { greet: 'def greet(who="World")' }, tip: 'A default value is used when the caller leaves that argument out.' },
      { task: 'Define power(base, exp=2) that returns base ** exp', code: 'def power(base, exp=2):\n    return base ** exp', check: 'assert power(3) == 9', data: { power: 'def power(base, exp=2)' }, tip: 'Arguments with defaults must come after the ones without.' },
      { task: 'Call power with 3 and exp=3, store the answer in cube', code: 'cube = power(3, exp=3)', check: 'assert cube == 27', data: { cube: '27' }, tip: 'Keyword arguments like exp=3 make a call easier to read.' },
    ] },
    { concept: 'while loops', reps: [
      { task: 'Set i to 0, then add 1 to i while i < 3', code: 'i = 0\nwhile i < 3:\n    i += 1', check: 'assert i == 3', data: { i: '3' }, tip: 'A while loop keeps going as long as its condition is True.' },
      { task: 'Set countdown to 5, then subtract 1 while countdown > 0', code: 'countdown = 5\nwhile countdown > 0:\n    countdown -= 1', check: 'assert countdown == 0', data: { countdown: '0' }, tip: 'If the condition never turns False, the loop runs forever.' },
      { task: 'Set money to 100, then subtract 30 while money >= 30', code: 'money = 100\nwhile money >= 30:\n    money -= 30', check: 'assert money == 10', data: { money: '10' }, tip: 'break leaves a loop early; continue skips to the next round.' },
    ] },
    { concept: 'try / except', reps: [
      { task: 'Try bad = int("abc"); on ValueError set bad to 0', code: 'try:\n    bad = int("abc")\nexcept ValueError:\n    bad = 0', check: 'assert bad == 0', data: { bad: '0' }, tip: 'try runs code that might fail; except catches one specific error type.' },
      { task: 'Try oops = 10 / 0; on ZeroDivisionError set oops to None', code: 'try:\n    oops = 10 / 0\nexcept ZeroDivisionError:\n    oops = None', check: 'assert oops is None', data: { oops: 'None' }, tip: 'Catch the exact error you expect; a bare except: hides real bugs.' },
      { task: 'Try missing = person["email"]; on KeyError set missing to "none"', code: 'try:\n    missing = person["email"]\nexcept KeyError:\n    missing = "none"', check: 'assert missing == "none"', data: { missing: '"none"' }, tip: 'Add finally: for code that must run whether or not an error happened.' },
    ] },
  ] },
]

const stepsOf = level => level.concepts.flatMap(({ concept, reps }) =>
  reps.map((rep, index) => ({ ...rep, concept, rep: index + 1, repCount: reps.length })))

export const RAPID_FIRE_STEPS = levels.flatMap(stepsOf)

export const FULL_RUN_ID = 'full'

// Each level starts from the program and data the earlier levels leave behind.
export const RAPID_FIRE_LEVELS = [
  ...levels.map((level, index) => {
    const earlierSteps = levels.slice(0, index).flatMap(stepsOf)
    return {
      id: level.id,
      title: level.title,
      steps: stepsOf(level),
      startingCode: earlierSteps.map(step => step.code).join('\n'),
      startingData: Object.assign({}, ...earlierSteps.map(step => step.data)),
    }
  }),
  { id: FULL_RUN_ID, title: 'Full run', steps: RAPID_FIRE_STEPS, startingCode: '', startingData: {} },
]

export const RAPID_FIRE_STORAGE_KEY = 'synlab_rapid_fire_v1'

export function valueType(value) {
  if (value.startsWith('def ')) return 'function'
  if (value.startsWith('"')) return 'str'
  if (value.startsWith('[')) return 'list'
  if (value.startsWith('{')) return 'dict'
  if (value === 'True' || value === 'False') return 'bool'
  if (value === 'None') return 'None'
  return value.includes('.') ? 'float' : 'int'
}

// Time on the clock, minus any time spent paused.
export function elapsedMs({ startedAt, finishedAt, pausedAt, pausedMs }, now = Date.now()) {
  if (!startedAt) return 0
  return Math.max(0, (finishedAt ?? pausedAt ?? now) - startedAt - pausedMs)
}

export function formatDuration(milliseconds) {
  const totalTenths = Math.floor(milliseconds / 100)
  const minutes = Math.floor(totalTenths / 600)
  const seconds = Math.floor(totalTenths / 10) % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}.${totalTenths % 10}`
}
