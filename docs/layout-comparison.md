# Two consistent SyntaxLab layout demos

Current status (2026-10-28): see [the completed curriculum review](curriculum-audit.md).
The notes below preserve the earlier plan or sample review; counts and pending
items describe that stage. The approved island and all 75 guided questions are
now available on the normal local route. Nothing has been published.

Fernando requested two alternatives before choosing the final UI. Both cover
LeetCode Python, Python Basics and Interview Prep with shared visual treatment.

| Design | Coding sections | Interview reference |
| --- | --- | --- |
| A: Floating island | Rounded application frame; exercise library above instructions on the left; full-height editor and feedback on the right | Matching frame, typography and navigation; full document scrolling |
| B: Open practice | Open page; narrow library sidebar; instructions above the editor, followed by feedback | Matching open-page header and cards; full document scrolling |

Both use the same authored curriculum, Monaco/Python execution, hints, saved
work, checks and navigation. These are interactive demos, not screenshots or
separate copies of the application logic. Mobile and short windows retain
document scrolling so controls stay reachable. Coding editors use a consistent
dark surface in either site theme.

## Open the demos

- A: `http://127.0.0.1:4318/?layout=island#python`
- B: `http://127.0.0.1:4318/?layout=flow#python`

Use the top A/B links to switch while keeping the current section. The three site
tabs expose each version's other pages. The normal study preview on port 4317
keeps its original build and browser storage. Both comparison links on port 4318
share their own origin's drafts/progress, allowing a direct comparison.

The local comparison build includes a byte-for-byte snapshot of the original
authored 30-question bank so the original editor can be tried without starting
the backend. Only explicit localhost/127.0.0.1 layout links use that asset;
normal study and deployed API access retain their existing route.

## Rebuild and run

From the repository root, using existing dependencies:

```powershell
node frontend/scripts/build-layout-demos.mjs
```

From `frontend/`:

```powershell
node node_modules/vite/bin/vite.js preview --outDir mockups/python-path/.cache/layout-demos --host 127.0.0.1 --port 4318 --strictPort
```

The build output and screenshots stay under ignored `.cache/`; the normal
`frontend/dist` build is preserved. The initial six layout source files were
backed up under `.cache/pre-layout-comparison/` before the comparison edits.

Browser verification from the repository root:

```powershell
node frontend/mockups/python-path/tests/layout-browser.mjs
```

It checks geometry for both layouts, real Python execution, keyboard Run/Next,
pattern navigation, scrollable interview content, narrow/short screens and A/B
switching with retained drafts. No design is selected for publication by adding
these previews. No commit, push or deployment is included.

## Verification, 2026-10-26

Both final demos passed the complete browser comparison, including original and
new Python execution, keyboard Run/Next, geometry, pattern navigation, reference
scrolling/search, mobile/short-screen layout and A/B switching with preserved
drafts. Lint, preview build, 21 Node checks, diff checks and changed-source secret
scan passed. A separate regression through the compiled default interface passed
the existing study workflow and all 216 authored solutions in its Pyodide worker.
The final spacing changes apply only to the two demo branches.

Screenshots are under `frontend/mockups/python-path/.cache/layout-{island,flow}-`
with `basics`, `leetcode`, `patterns`, `interview`, `mobile-basics` and
`mobile-interview` suffixes. Existing Monaco bundle/CDN limitations remain; these
previews are local, not a published release or a complete accessibility audit.
