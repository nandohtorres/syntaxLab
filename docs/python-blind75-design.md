# Python Fluency for Engineering Interviews

Design draft, 2026-10-19. Prepared for Fernando's personal job preparation.
This defines a new SyntaxLab section. A standalone [first-exercise preview](../frontend/mockups/python-path/README.md) is implemented for feedback; the existing app is unchanged.

## Goal and boundary

First become comfortable reading, explaining, writing and changing ordinary
Python. Fernando has not worked directly with Python and needs usable language
knowledge for either a software engineering or solutions architect interview.
The course must produce useful scripting ability before advanced algorithms.

Build one shared language foundation with two connected applications:
**Practical Scripts** and **Blind 75**. Repeat small skills until they are
available from memory, then use them in both applications. Blind 75 remains
the fixed algorithm inventory; it is not the definition of Python proficiency.
Neither track claims to cover an entire role's interview preparation.

**Default experience: rapid-fire coding reps in a real code editor.**
A short task sits above Monaco; the learner writes/runs Python, sees immediate
specific feedback and advances to another small task. No multiple-choice cards,
answer-choice buttons or text-answer quiz screens. Keep the editor central even
when an exercise only needs one line. Scripts and full Blind 75 solutions are
later application checkpoints assembled from the same skills.

## Rapid-fire interaction contract

- One small coding task and one new concept per rep. Examples: create a
  variable, finish a function, fix a line, change an existing snippet or add a
  file. Instructions are tasks, not multiple-choice questions.
- Start with 10-rep rounds and unlimited More reps. Aim for roughly 10-30 seconds
  for a one-line rep and 30-60 seconds for a tiny function; these are authoring
  targets, not deadlines or measured performance claims.
- Write -> Run code -> specific feedback below the editor -> explicit Next.
  Preserve the submitted code for inspection; never auto-advance before feedback
  can be read. Detailed explanations are optional expansions.
- Use actual Python execution with fresh attempt state, plus syntax checks
  where a lesson requires a particular construct. Never grade code with simple
  answer-string matching or silently simulate an interpreter.
- Preload Python while the learner reads and types. Run only on explicit action,
  provide keyboard access, show loading/running states, and allow stopping.
- Revisit mistakes after 2-4 intervening reps using fresh names/values. Hints and
  worked solutions remain available without certifying independent recall.
- Reading/tracing/explaining supports the coding task. For example, inspect a
  supplied snippet, modify its assignment and run it; do not replace the editor
  with a prediction quiz. Timing and celebrations are optional.

```text
Python Path / Variables                                  REP 01
Create a variable named retries and set it to the integer 3.

main.py
  1  # Write your Python here
  2  |

Hint                                    Run code  [Ctrl/Cmd+Enter]
Feedback appears here.                                  Next rep
```

First exercise: a correct solution such as `retries = 3` passes. A string value,
wrong integer, comparison instead of assignment, missing variable or syntax
error receives a short targeted correction. Valid equivalent Python is accepted.
Next ends this one-exercise preview; it does not claim the rest is implemented.

The problem inventory is fixed in [python-blind75-curriculum.json](python-blind75-curriculum.json):
75 unique LeetCode IDs, each with a teaching module and a preparation drill.
Foundation exercises and practical scripts are original supporting work, not
additional algorithm interview lists. No substitution of Grind 75 or LeetCode
75. A changed title or access restriction must not silently replace a problem.

## Observable learning objectives

The initial outcome is being able to pick up Python when a task calls for it.
The learner should be able to:

- Read a short unfamiliar script aloud in plain English: its input, each major
  operation, control flow, returned/output values and possible failures.
- Trace variables through conditions, loops, function calls and mutations;
  distinguish assigning a value, calling a function and invoking a method.
- Write a small script from a requirement, create its files, run it, and
  explain why its output is correct. Use documentation for unfamiliar library
  APIs; do not confuse memorizing every API with knowing the language.
- Change an existing script safely: add a filter, accept another input,
  extract a helper, handle a bad record, or change the output format.
- Describe basic operational choices: validate input, handle expected errors,
  avoid hardcoded secrets, separate configuration, and avoid accidental writes.
- For Blind 75, explain the algorithm independently of Python notation, then
  implement it and reason about boundaries and time/space costs.

Explain code's purpose and behavior, not just pronounce its punctuation.
Example: for `counts[name] = counts.get(name, 0) + 1`, explain that the code
retrieves the current count (zero for a new name), increments it and stores it.

## Shared foundation, two applications

```text
Read Python <-> trace it <-> write it <-> change it <-> explain it
                             |
                   Shared language foundations
                     /                     \
          Practical Scripts             Blind 75
          files, data, automation        structures, patterns, reasoning
```

Start with ordinary examples and small scripts. Introduce algorithm problems
when their prerequisites are comfortable, without forcing completion of all
75 to demonstrate useful Python. Recommend a balanced session after the shared
basics; allow either application to be selected without declaring a final job
title. Architecture/system-design and behavioral preparation are separate work.

## Section and screens

Add **Python Path** to the header beside the existing exercise workspace.
Within the section: **Continue**, **Foundations**, **Scripts**, **Blind 75**, **Review**.
The existing exercise list remains usable while this section is built.

```text
Python Path                  Foundations | Scripts | Blind 75 | Review

Continue: Functions / returning a value                  Start practice
Apply it: summarize a supplied service inventory         Practice a script
Review next: assignment, loop boundaries                 Review skills

Foundations -> practical scripts AND small operations -> Blind 75 patterns
```

The primary action starts rapid-fire coding reps, not quiz cards or a long chapter. The default
starts at the beginning, with a voluntary placement check or
direct lesson selection for topics already familiar. Recommendations guide
the order; users can inspect any lesson without hard locks.

```text
Functions > Return a value                          Rep 3 of 8

Write add_tax(price, tax). Return the total.
Example: add_tax(10, 2) gives 12.

Prompt / optional short explanation | main.py editor
Hint 1 -> Hint 2 -> Worked solution  | Output / checks

Run     Reset attempt                              Next variation
```

Each prompt introduces one new demand. Learning screens show worked examples;
recall screens start blank or with an explicitly identified scaffold. Next
variation changes the task, not just the question number. A pass keeps code
visible long enough to inspect; advancement never depends on a click game.
Mobile uses task/editor/output tabs; file tabs appear only when introduced.
Run/next are keyboard accessible, animation optional, timers off by default.

## Foundations course

F01-F13 are design IDs, not existing question IDs. The JSON records their
prerequisites. References below describe teaching scope, not completed lessons.

| Unit | Learn and repeatedly write | Exit exercise |
|---|---|---|
| F01 Start a Python program | Values, `print`, comments, statements, indentation, reading output | Write a short greeting program from blank |
| F02 Variables and types | Assignment, reassignment, names, `int`, `float`, `str`, `bool`, `None`, conversion | Store values and update a counter |
| F03 Expressions | Arithmetic, `//`, `%`, comparisons, `and`/`or`/`not`, precedence | Compute a remainder and evaluate a condition |
| F04 Strings | Indexing, slicing, immutability, f-strings, `strip`, `split`, `join`, case | Normalize and combine words |
| F05 Decisions | `if`/`elif`/`else`, indentation, nested decisions, boundary cases | Classify several inputs with the same code |
| F06 Repetition | `for`, `range`, `enumerate`, `while`, updates, `break`, `continue` | Count and accumulate without off-by-one errors |
| F07 Containers | Lists, tuples, dicts, sets; indexing, membership, `.get`, `.append`, `.pop`, aliasing and copies | Count repeated values in a dictionary |
| F08 Functions | `def`, calling, parameters versus arguments, defaults, `return` versus `print`, scope, helpers, simple type hints | Write and call a function that handles several inputs |
| F09 Classes and methods | `class`, instances, `self`, `__init__`, attributes, method calls, identity, `Solution`, node objects | Create a small class and invoke its method |
| F10 Files and modules | Create/save `.py`, run a script, `import`/`from`, main guard, paths, `with open`, text/JSON/CSV read/write | Create a helper module and a separate importing script |
| F11 Debugging and checks | Tracebacks, syntax/runtime/logic errors, `try`/`except`, validation, assertions, actual versus expected, edge cases | Repair a script and handle malformed input clearly |
| F12 Interview Python | `sorted(key=...)`, unpacking, comprehensions after loops, `Counter`, `defaultdict`, `deque`, `heapq`; basic time/space costs | Choose and use the right container operation |
| F13 Recursion | Base case, smaller subproblem, call stack, returned results, nested helpers, memoization | Trace then write a terminating recursive helper |

Functions and methods are taught separately: a standalone function is called
directly; an instance method is defined on a class and receives `self`. Introduce
the LeetCode `Solution` wrapper after the learner can already write a function.
Do not require inheritance, advanced decorators, async, packaging or web
frameworks. Basic scripts need functions and modules, not a class hierarchy.

File creation has two explicit meanings: creating Python source files, and
creating/reading data files from Python. Teach both. In-browser files live in
the learner's virtual workspace, not automatically on the Windows disk.
Offer download/export of the workspace later and an optional local command
example; do not imply the browser has launched a host terminal.

Early Blind 75 problems become recommended as soon as their own prerequisites
are ready. File I/O is a real part of the foundations course but is not an
artificial prerequisite to an array problem.

## Every skill's repetition sequence

1. Read a minimal explanation and an annotated example; explain its behavior.
2. Complete one missing expression or line.
3. Write the same operation from a plain-language prompt, without the example.
4. Repair a common mistake or predict the output before running.
5. Write a changed version with new inputs, names or a different requirement.
6. Change a requirement, explain the change, and combine the skill with one
   already learned; revisit after a delay.

Alternate **Read**, **Trace**, **Write**, **Modify** and **Explain** exercises.
A correct code submission must not stand in for evidence in all five modes.
Read/trace prompts include short code not previously memorized; explanation
uses a suggested checklist and self-review, not an automatic speaking grade.
No microphone or speech-recognition feature is required to practice aloud.

Allow unlimited **More reps** at each stage. A starting 10-rep round can include
four due-review reps, four variations of the current skill and two short
application reps. Fill unavailable categories with appropriate beginner reps;
never introduce untaught syntax just to satisfy the mix. The round gives a
stopping point, not a requirement to grind forever; duration is user-controlled.

For a first build, author bounded variations and their tests together. Do not
generate arbitrary live exercises or grade ordinary code with a model. Keep a
stable template/seed so a failed variation can be reproduced. Repeated identical
answers do not count as distinct evidence of understanding.

Hints progress from concept -> partial structure -> full worked solution.
Viewing a solution is valid practice, but the next independent recall uses a
fresh variant. Explain errors specifically: "This function prints the answer
but returns None" rather than only showing a Python traceback.

## First lessons, ready for authoring

**Variables:** assign `age = 25`; assign a different name/value; create a string;
update an existing integer; distinguish `=` and `==`; fix an undefined name;
predict a reassignment's output; create two variables from a blank editor.
Introduce only syntax already explained; avoid f-strings in the first task.

**Functions:** recognize a definition/call; complete `def greet(name):`; indent
its body; return a string; call it and store its return; accept two parameters;
fix `print` used instead of `return`; write a new function from blank; call the
same function with zero, negative and ordinary values where the contract allows.

**Methods:** create a `CounterBox` with `self.value`; initialize it; write an
`increment` method; call it on an instance; compare two independent instances;
then express an already-solved function as a `Solution` method. Distinguish
instance identity from equal attribute values before linked lists.

**Files:** create `main.py`; run it; create `helpers.py` with a function; import
and call it in `main.py`; add a main guard; create `data/values.txt` using a
context manager; read it and convert lines to integers; handle a missing file
in a separate explicit error-handling lesson. An import should not accidentally
repeat script-only output. Reset files to supplied fixtures on a new attempt.

## Practical Scripts: a first-class application

Each script is first decomposed into small editor-based completion, repair, writing and modification reps. A
complete implementation is an optional or milestone checkpoint, clearly shown
as longer practice. Each script has read/trace tasks, small writing reps, a complete implementation,
a changed requirement and an explain-it-aloud checkpoint. All data is supplied
or virtual; no cloud account or live external system is needed.

| Project | Contract | Changed requirement |
|---|---|---|
| S01 Summarize an inventory | Filter a supplied list of service dictionaries and return a count by status | Add a region filter and handle a missing status |
| S02 Summarize a log file | Read a small text fixture, count severity levels and report malformed lines | Return only warnings/errors without losing the rejected-line count |
| S03 Validate a configuration | Load JSON, check required fields/types and report clear validation errors | Add an optional field and distinguish missing from explicitly false |
| S04 Produce a CSV report | Read sample resource rows, normalize fields and write a summary | Change grouping and handle empty input or invalid numeric fields |
| S05 Assemble a reusable script | Split loading/processing/reporting into modules; introduce arguments, basic logging and exit behavior | Support another input path and a dry-run mode that performs no output writes |
| S06 Read and adapt an API script | Use a supplied fake client with success/error/timeout/page fixtures; explain configuration and call flow | Process all supplied pages, handle a failed page and explain retry tradeoffs |

Teach any new library/API syntax within its project before testing it. S06 is
an offline boundary exercise, not proof of production SDK experience. Introduce
the difference between language knowledge, reading library documentation and
understanding operational behavior. AWS SDK specifics can be a later lesson,
not a prerequisite or an excuse to make real AWS calls during practice.

The course's first useful milestone is small: explain a script not seen before,
write a function, read a supplied file, produce a result, and adapt it to one
new requirement. Later checkpoints add methods, multiple files and errors.
Do not wait for trees, graphs or dynamic programming to reach this milestone.

An interview explanation checklist asks: What problem does this solve? What
comes in and goes out? Why these types/operations? What changes during the
loop? What happens with bad/empty input? How would I modify or test it? Discuss
simple tradeoffs without claiming that a small exercise is production-ready.

## Bridge from language to problems

Before a full problem, drill the exact small operations it combines: traverse
with an index, keep a running total, remember a minimum, count occurrences,
check a complement, move two indices, update one link, visit neighbors, or
define and update a DP state. Each problem's JSON entry specifies its first
preparation drill; its module supplies the rest of the prerequisite practice.

Examples of complete learning chains:

- Assignment -> membership -> set updates -> detect repeated values -> #217.
- Dictionary lookup -> indexed traversal -> check a complement -> #1.
- Function calls -> references -> `ListNode` -> preserve the next link -> #206.
- Base cases -> recursive return -> tree node -> combine child depths -> #104.
- State meaning -> recurrence -> table initialization -> transitions -> #70.

After the chain is practiced, attempt the corresponding problem with its
pattern label hidden. Teach pattern selection with counterexamples, not
keyword matching. Python implementation practice and algorithmic reasoning
remain separately visible in feedback.

## Blind 75 problem experience

The default is small editor-based coding reps tied to the fixed problem inventory.
Full-problem mode is a separate, longer application session. Learning mode
offers guided steps; independent mode presents an unlabelled
problem. Each uses: clarify inputs/output -> work an example -> simple approach
-> identify repeated work -> choose an approach -> explain its invariant or
state -> implement -> test boundaries -> explain time/space costs.

Keep code execution separate from reflection. Tests check executable behavior;
an explanation checklist supports self-review without pretending to certify
reasoning automatically. Store a short note about why the approach works and
what originally caused trouble. Optional interview timing comes after learning.

The curriculum JSON places each of the 75 in one primary teaching module to
avoid double-counting. Modules may have dependencies across earlier topics;
their numeric order is a recommended learning order, not a claim that every
problem in one module is easier than every problem in the next.

Problem statements, lesson explanations, test fixtures and worked solutions
will be authored for this course. Store official problem IDs/links. Historically
restricted problems stay in the inventory with independently written equivalent
practice contracts; never scrape restricted statements or require a subscription
to complete the local learning track. Access flags are historical notes and
must be checked when content is authored.

## Practice memory and continuous improvement

Store versioned attempts separately from the old completion booleans:
`exerciseId`, `contentVersion`, `variantSeed`, practice mode (read/trace/write/
modify/explain), application (foundations/scripts/blind75), timestamp, outcome,
hints/reveal, error category, and optional learner note. Store per-skill independent successes,
last practice and due date; keep code drafts in a separate workspace record.
Use a new storage namespace so existing progress is preserved. Offer export.

Starting policy, explicitly tunable: mark a skill **Practicing** after success,
and **Retained** only after three distinct unassisted variants including one
on a later day. A miss creates a targeted correction, then another variant
after intervening tasks. Start reviews at roughly 1/3/7/14 days, shorten after
misses, and never create a punitive catch-up wall. These are product defaults
to evaluate, not research-certified mastery thresholds.

Record whether difficulty was syntax, tracing, data structures, approach,
implementation, edge cases or explanation. Use that category to recommend a
specific drill, not a restart of the whole course. Blank-editor solves after a
delay and performance on changed inputs matter more than time spent or streaks.
Skill versions prevent an old easy exercise from certifying a revised skill.
Show reading/tracing, writing, modification and explanation separately. Keep
explanation self-review distinct from test-verified code outcomes. "Retained"
applies to the practiced skill/mode, not an overall claim of interview readiness.
Record whether code was written, completed, repaired or modified, and the amount
of scaffold/hint support. Speaking an explanation aloud is a distinct
self-reviewed action; it is not an automatically graded quiz.

## Integration shape and build order

Keep React/MUI/Monaco and browser-only Python. The new section needs separate
course metadata, drill attempts, virtual files and lesson navigation; it should
not overload the current `Question` record or `synlab_progress` boolean map.
Serve a versioned, authored curriculum through the existing content layer in a
later implementation. This JSON is a design manifest, not a working API payload.

Proposed components are PathOverview, LessonSession, FileWorkspace, ProblemSession
and ReviewQueue, backed by small curriculum/progress/runner modules. Reuse the
existing theme and editor where appropriate. A file workspace adds tabs and
file creation; it does not need an entire desktop IDE clone.

Build in reviewable slices:

1. Add section navigation, the rapid-fire editor/feedback/next loop and F01-F03
   authored coding reps with repeated variants. Include a complete first rep
   with a real editor, tiny code submissions and actual Python feedback.
2. Add F04-F08, S01 and read/trace/write/modify/explain practice. The first usable
   milestone is a short ordinary Python program, not a LeetCode score.
3. Add F10-F11, S02-S04 and a virtual file workspace. Teach F09 methods alongside
   this milestone without forcing classes into simple scripts. Add S05-S06
   after the underlying input, validation and module concepts are practiced.
4. Add the bridge through #217 and #1, then F12-F13 and the remaining fixed
   inventory module by module. Continue practical script variations in parallel;
   review scheduling includes both uses of a shared skill.

Runner requirements for implementation: browser worker, stop/timeout behavior,
fresh namespaces and attempt filesystem/module state, captured stdout/stderr,
stable entrypoints and shape-aware results. A worker alone is not a complete
security sandbox. For focused syntax lessons combine Python AST checks with
behavior tests; ordinary problems accept different valid implementations.
Check object mutation and return shape for linked structures and grids; do not
assume every solution returns a scalar. Use operation-based complexity lessons
rather than browser wall-clock timing as an asymptotic correctness test.

Acceptance checks for each slice: intended syntax is actually exercised;
equivalent valid answers pass; hardcoded example answers fail changed inputs;
prior attempts cannot make empty code pass; hints cannot mark independent
success; stop recovers from an infinite loop; file imports do not use stale
modules; node/graph serializers handle cycles; progress survives refresh and
old progress remains intact. Add meaningful automated checks when implementing.

## Sources and inventory provenance

- [Blind 75 author and original-list links](https://www.techinterviewhandbook.org/best-practice-questions/).
  The later 50-question schedule on that page is not our inventory.
- [Original categorized list linked by its author](https://leetcode.com/discuss/post/460599/blind-75-leetcode-questions-by-krishnade-9xev/).
  Deduplicate the heap/list overlap by ID. Ignore old difficulty labels.
- [Author's earlier topic article](https://www.freecodecamp.org/news/coding-interviews-for-dummies-5e048933b82b/).
  Its additional practice links are not automatic additions to this track.
- Python tutorials: [functions](https://docs.python.org/3.14/tutorial/controlflow.html),
  [modules](https://docs.python.org/3.14/tutorial/modules.html),
  [classes](https://docs.python.org/3.14/tutorial/classes.html),
  [file I/O](https://docs.python.org/3.14/tutorial/inputoutput.html).
- Existing curriculum prior art: [Exercism concept exercises](https://exercism.org/docs/building/tracks/concept-exercises).
  Use explicit prerequisites, small teaching objectives and authored hints.
- Execution prior art: [Pyodide workers](https://pyodide.org/en/stable/usage/webworker.html)
  and [custom namespaces](https://pyodide.org/en/stable/usage/faq.html#how-can-i-execute-code-in-a-custom-namespace).

Module ordering, drills, review defaults and the screen layouts are proposed
design decisions for this course, not requirements asserted by these sources.
