# Python Path

A functioning learning workspace using the approved editor layout, now integrated
into the normal SyntaxLab frontend. The standalone preview below is still
available for isolated development. Wider UI redesign remains deferred.

From this worktree root:

```powershell
node frontend/mockups/python-path/serve.mjs
```

Open **http://127.0.0.1:4315/**. The helper reads existing frontend dependencies
from this checkout or the sibling `synlab` checkout; it installs nothing.

The recommended path is 95 foundation reps across 13 units, 32 pattern building
blocks across 15 modules, six practical scripting tasks, then the original Blind
75. All 208 exercises have authored prompts, starter files, hints, reference
solutions and runnable behavior checks. Browse/search and unit navigation let you
revisit any exercise. The original 75 inventory and provenance remain in
[the curriculum manifest](../../../docs/python-blind75-curriculum.json).

Write actual Python in Monaco. Run code or press Ctrl/Cmd+Enter, inspect the
feedback, then Next rep. Add workspace files for module/import exercises; supplied
fixtures are editable. Generated output files are read only and downloadable;
they are not reused as inputs on the next attempt. Reset restores starter files
after confirmation. A summary appears after each ten successful reps.

Hints, revealed answers and corrections after a mistake count as assisted work.
Mistakes enter a queue for a fresh variation after intervening reps where one
exists. Due review also includes failed attempts immediately, assisted passes
after ten minutes, and independent passes after 1/3/7/14 days. Repeated runs of a
saved answer count as assisted; reset it before a fresh independent attempt.
Retained status needs independent evidence on different days and different
variants where available. These labels are learning heuristics, not certification.

Drafts, progress and optional explanation notes live only in this browser under
`synlab_python_path_v1`. Export/import JSON backups to switch devices; importing
requires confirmation before replacing this section's data. No account sync or
backend grading is implemented. Existing app progress keys are untouched.

Python executes in a worker with Pyodide 0.26.4 (Python 3.12). Its first load
requires the jsDelivr CDN. Each attempt uses a fresh namespace and temporary
virtual file workspace. Stop or a five-second timeout restarts the worker.
The worker keeps the UI responsive; it is **not a security sandbox** for hostile
code. Exercises use small fixtures, not full LeetCode judge coverage. Passing
checks does not establish optimal complexity or complete interview readiness.
Monaco's large bundle and cold runtime download remain performance limitations.

Validation commands (no new dependencies):

```powershell
node frontend/mockups/python-path/tests/export-content.mjs
..\archibrief\backend\.venv\Scripts\python.exe frontend/mockups/python-path/tests/verify_content.py
node --test frontend/mockups/python-path/tests/progress.test.mjs
node frontend/mockups/python-path/tests/browser.mjs
node frontend/mockups/python-path/serve.mjs build --logLevel error
```

The browser script uses an existing local Playwright installation; override its
path with `PLAYWRIGHT_PACKAGE` on another machine. Native verification executes
only authored reference solutions. Reports under ignored `.cache/` record 208
reference passes and 438 checks, with all starter workspaces failing as expected.
The browser checks all 208 references in real Pyodide plus editor feedback,
next/search, multi-file creation and imports, saved drafts/notes after reload,
hints, backup export/import, stop/recovery and mobile overflow/navigation.
Six Node tests cover retention, assistance, review scheduling, duplicate results,
retry selection and backup/path validation. The production build passes. These
initial checks exercised the standalone section; production integration checks
below also verify the original application and navigation between all sections.

Based on Pyodide's [worker guide](https://pyodide.org/en/0.26.4/usage/webworker.html)
and [virtual filesystem](https://pyodide.org/en/0.26.4/usage/file-system.html).

## Interview prep

A second tab is now available at `http://127.0.0.1:4315/#interview`.
It contains 29 ordered topics, 66 short typed-response drills and 22 correction/
scope entries based on the supplied PDF and reusable study guide. Both sources
were read in full and remain unchanged. Personal narratives and historical hiring
claims are not copied into the app. The source documents are not served by Vite.

Use Study sheet, then Start practice: type a short explanation, query or code
fragment in Monaco, Check my recall (or Ctrl/Cmd+Enter), compare with the reference
and tick criteria your original response already covered. Needs another rep
queues a related prompt; self-rated recall has its own review schedule. Rounds
summarize ten responses. This section does not execute answers or use an AI judge.
It uses `synlab_interview_recall_v1`, separate from Python Path. Exports identify
the section so a backup cannot accidentally overwrite the other section.
Interview-only visits do not download the Python runtime.

Printable artifacts:

- [Cheat sheet with all 66 drills at the end](../../../docs/interview-prep-cheat-sheet.md)
- [Corrections and verification sources](../../../docs/interview-prep-corrections.md)

Additional checks:

```powershell
node frontend/mockups/python-path/tests/build-study-docs.mjs
node --test frontend/mockups/python-path/tests/progress.test.mjs frontend/mockups/python-path/tests/interview.test.mjs
node frontend/mockups/python-path/tests/interview-browser.mjs
```

Validation: ten Node tests pass; the interview browser workflow passes for
search/study, blank response gating, keyboard reveal, rubric controls, missed
reps, ten-response rounds, correction notes, saved drafts, section-specific
export/import and mobile overflow. Four interview screenshots sit beside the
Python screenshots. Primary-source links and source snapshot hashes are recorded
in the generated docs; regenerate them from the shared content with the command
above so the app and printable sheet agree.

## Main-site integration (2026-10-20)

The normal SyntaxLab frontend now imports this workspace with three site tabs:
Original practice, Python Path (`/#python`) and Interview prep (`/#interview`).
Use the normal frontend build for publication; the standalone server above is
still available for isolated development. Section components are lazy-loaded,
visited editors remain mounted across tabs, and original progress keys are kept.
See [integration and release notes](../../../docs/python-path-site-integration.md).

Local preview and online storage are different browser origins. Export/import a
backup if you want to carry existing local practice data onto the deployed site.
The new sections retain their approved dark layout; original practice keeps its
existing light/dark appearance controls. Whole-site visual consolidation remains
separate work. Build and browser validation do not imply a public release until
the publishing workflow has completed.
