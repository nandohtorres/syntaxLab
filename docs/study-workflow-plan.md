# Three-section study workflow

Current status (2026-10-28): see [the completed curriculum review](curriculum-audit.md).
The notes below preserve the earlier plan or sample review; counts and pending
items describe that stage. The approved island and all 75 guided questions are
now available on the normal local route. Nothing has been published.

Approved direction, 2026-10-26: keep LeetCode Python, Python Basics and Interview
Prep separate. Interview Prep is reference-only for this release.

## Ordered implementation

1. Preserve the existing seven-file uncommitted visual rework. Keep old URLs,
   question IDs, drafts, progress and interview recall data compatible.
2. Split the existing curriculum into Basics (foundations and practical scripts)
   and LeetCode (original 30 exercises, 15 pattern modules and Blind 75). Use one
   shared, race-free persistence owner for existing Python Path data, with separate
   selections per section. Do not reset or silently discard other-track progress.
3. Make Basics compact: prompt, editor, Run and Next together; optional workspace
   tools and notes; ordered/mixed practice, due review and clear session counts.
   Add beginner type variations and align syntax requirements with prompts.
4. Make Interview Prep a searchable, category-based reference. Add concise
   examples, HTTP lookup, testing/debugging and small system-design tradeoffs.
   Preserve deeper notes and sources behind expansion. Preserve old quiz code and
   local answers; remove quiz controls from the normal site.
5. Explain all 15 LeetCode pattern families with recognition cues, operations,
   invariant/trap and practice links. Keep the existing API question bank intact.
6. Validate production build, lint, authored solutions and alternate/wrong answers,
   old/new navigation, cross-section persistence, keyboard controls, mobile/short
   desktop layouts and API/runtime failure handling. Update the release handoff.

## Completion criteria

- Exactly three top-level sections; basics never schedules algorithm problems.
- A beginner can write, run and advance without a full-page editor workflow.
- Interview topics are usable without Python runtime, quiz or backend access.
- Existing progress/backups survive, including records from the other section.
- Pattern practice teaches recognition and reasoning, not only code templates.
- No new paid service, dependency installation, push or deployment is included.

## Release notes

This is the local implementation plan. Publishing needs a specific push
instruction and a reviewed deployment. Existing unsaved visual changes belong to
the prior session; identify them separately in the final handoff.

## Implemented locally

All six implementation steps above are complete in the local candidate:

- Three top-level sections; existing URLs retained. Original 30 exercises stay
  available, with 15 pattern guides and 117 algorithm-oriented reps alongside.
- Basics contains 99 syntax/script reps (including variants), compact actions,
  keyboard Run/Next, same-unit mixed practice, scoped review and optional tools.
- Eight additional elementary type variations; valid reassignment alternatives
  now pass, with plausible wrong types/results and hardcoded answers checked.
- One shared persistence owner, separate selections and old-backup compatibility.
  Importing a replacement stops existing runs and invalidates stale outcomes.
- Reference-only Interview Prep: 36 topics, categories, search, HTTP quick lookup,
  examples, details/sources and printable companion `interview-reference.md`.
  Old quiz code and stored responses remain preserved.
- Global light/dark mode reaches all sections; editors retain a readable dark
  code surface. Mobile/short screens and dependency failures are covered.

Validation: lint and production build passed; 20 Node checks; 216/216 authored
solutions and 450 checks in native Python; 20/20 alternate/wrong-answer controls.
The compiled production browser workflow passed reference-only cold loading,
search/categories, light/dark mode, keyboard practice, original question
execution, cross-section drafts/progress, reload, backup replacement during an
active hidden run and mobile/short layouts. All 216 authored reference solutions
also passed in the compiled Pyodide worker.

Local preview: `http://127.0.0.1:4317/#python` and `/#interview`.
The original question bank needs its configured questions API. Browser tests
mocked that API; they are not a deployed backend verification. Coding still
requires its first Pyodide CDN download. Monaco retains a large build chunk;
accounts/device sync and future recall quizzes remain out of scope.

No backend, dependency lock, deployment workflow or remote repository changed.
The prior seven-file visual rework was saved to an ignored local patch before
edits and preserved in the candidate. Files remain uncommitted for review; no
push or deployment was performed. This plan does not authorize publication.
