# Curriculum review and release handoff

Reviewed locally on 2026-10-28. This describes the pending source changes, not
the currently published website. Nothing was pushed or deployed.

## Result

- Python Basics has **98 core drills and six optional projects**. Optional
  projects have their own count and are not required to finish core syntax.
- LeetCode Patterns has **75 canonical questions containing 162 graded parts**:
  75 full tasks and 87 preparation steps. Official numbers and titles are kept.
- Learning Hub has 21 teaching topics, four quirks and visuals/walkthroughs for
  all 15 pattern groups. Interview Prep source/data remains archived separately.
- The approved island layout is now the normal route, initially in light mode.
  The middle LeetCode tab opens by default. Preview comparison controls require
  an explicit layout query; they do not appear on the normal root page.

## Python Basics: reviewed unit by unit

| Unit | Review and changes |
|---|---|
| Start a Python program | Direct skill titles; print prompts quote the requested text; require a print call. |
| Variables and types | Three variations per elementary type; exact type checks reject strings, floats or booleans masquerading as integers. |
| Expressions | Clarify boolean conditions; require the requested boolean operator. |
| Strings | Method, f-string, slice and split/join explanations distinguish returned values and boundaries. |
| Branching | Clarify indentation and the three-way branch contract. |
| Collections | Move before loops; add three tuple drills and unpacking; distinguish copies and shared references. |
| Loops | Add break; require continue and enumerate where requested; distinguish stopping from skipping. |
| Functions | Explain inputs, return values and default arguments; check that sum_squares actually calls square. |
| Objects and methods | Separate instance state, initialization and method calls; existing multi-instance checks remain. |
| Files, imports and JSON | Keep file tools only where useful; main guard is tested both on import and direct execution. |
| Errors and validation | Define raw input as strings; validate port endpoints and reject bool, float, None and out-of-range values. |
| Collection helpers | Require a comprehension; move independent grid rows here because they rely on loops/comprehensions. |
| Recursion | Existing reference content remains preserved; recursion/state/helper examples also support pattern teaching. |
| Six practical projects | Keep explicitly optional, following Fernando's choice; concise explanations cover inventory, logs, configuration, CSV, modules and simulated pagination/retries. |

All 50 Basics/supporting skill entries have a short explanation and common
mistake. Repeated drills remain numbered variations beneath one lettered skill.
Ten older algorithm-oriented foundation drills stay recognized in storage and
the reference inventory; they are not extra top-level questions in the new
two-practice-section interface.

## Blind 75: reviewed pattern by pattern

Every full reference solution was read against its prompt and teaching note.
Each question now has a linked original, authored practice wording, an example,
preparation part(s), the full task, an explanation and additional edge/property
checks. Preparation tasks deliberately reuse focused operations where useful;
they are labeled warm-ups, rather than claimed as 75 bespoke decompositions.
LC #3 retains its approved four-part count/shrink/combine/full sequence.

| Pattern | Review focus |
|---|---|
| Array scans and running state | Later minima, zero products, all-negative sums/products; distinguish running state from recomputation. |
| Sets and dictionaries | Multiplicity, duplicate words, Unicode/length-prefixed text boundaries and valid alternative outputs. |
| Stacks | Closing order and unmatched brackets. |
| Two pointers and palindrome expansion | Character normalization, duplicate triples, odd/even centers, equal best answers and area bounds. |
| Sliding windows | Duplicate shrinking, repeated required characters and replacement limits; separate interactive traces for LC #3, #424 and #76. |
| Binary search | Check all rotations of a small distinct array and missing targets. |
| Intervals | Distinguish closed overlapping endpoints from half-open meetings; nested and touching intervals. |
| Matrices | Rectangular/single-row shapes, in-place transformations and original-zero propagation. |
| Linked structures | Node identity, cycle detection, reversal/reordering and boundary removals. |
| Trees and BSTs | Separate arbitrary binary trees from BST visuals; ancestor bounds, shape, all-negative paths, codec round trips and inorder reconstruction. |
| Heaps | Equal-priority objects, exact distinct top-k results, negative/even/odd streaming medians. |
| Graphs | Directed dependencies, isolated nodes, cycles, clone identity and equal-height/grid connectivity. |
| Backtracking and tries | Restore path state; distinguish prefixes from whole words; wildcard length and deduplicated board words. |
| Bits | Unsigned 32-bit boundaries, signed addition wraparound, popcounts and missing values. |
| DP and greedy reasoning | Greedy coin counterexample, strict LIS duplicates, word-segmentation traps, zero decoding, circular robbery and unreachable frontiers; problem-specific diagrams. |

The generic pattern illustration is identified as such; it is not presented as
a complete execution trace for every question. Why-this-works text follows the
actual reference algorithm, including quadratic LIS, heap-based meeting rooms
and the breadth-first JSON tree codec.

## Progress and navigation

Passing a warm-up records that part only. Passing the full canonical task marks
its question practiced. Skip earns no credit and moves to the next parent
question; after a pass it becomes Next part/question. Editing requires a fresh
pass. Revealed solutions and corrections remain assisted evidence.

Original lesson IDs, old sample IDs, drafts and earned records are preserved.
New preparation IDs are scoped to their parent question to avoid treating reused
warm-ups as distinct variants proving retention. Existing completed records are
not erased; rerunning an answer evaluates the strengthened current checks.
The older 30-question source and its storage remain preserved, but its extra
inner tabs are removed from the normal route. No legacy question API is needed.

## Verification

Reproducible commands and browser prerequisites are in the
[workspace guide](../frontend/mockups/python-path/README.md).

- 35 Node tests cover inventory, order, progress, persistence, navigation,
  variable part counts, archive integrity and source metadata.
- All 221 underlying reference solutions pass 545 checks; every starter fails.
- All 162 guided LeetCode reference solutions pass; every starter fails.
- 35 Basics alternate/wrong-answer controls, two main-guard controls and four
  algorithm controls pass. A valid alternate Two Sum implementation is accepted;
  duplicate top-k answers and numeric/boolean type lookalikes are rejected.
- All 25 displayed Python teaching/quirk examples produce the documented output.
- Browser checks cover every question panel, part selectors, real Python
  execution, Basics outline/variations, draft persistence, no skip credit,
  pass/edit/Next transitions, Learning Hub, dark mode and mobile overflow.
- Frontend lint and the isolated production build pass. The build retains the
  known large Monaco chunk and optional missing Sentry upload-token warnings.

## Publication boundary and limits

Review the refreshed local demo at http://127.0.0.1:4319/ before publishing.
Publishing remains a separate owner-authorized step; this session does not push,
deploy or modify the hosted site. Existing local/deployed browser origins have
separate progress; no automatic cross-device transfer is claimed.

These are authored learning checks, not the full LeetCode judge or proof of an
optimal algorithm. No stress/performance certification or complete accessibility
audit is claimed. Pyodide still downloads from its CDN on first use; browser-local
saving and the editor bundle's size remain product limitations. Larger account
sync, offline packaging, exhaustive bespoke walkthroughs and performance grading
would be separate work.
