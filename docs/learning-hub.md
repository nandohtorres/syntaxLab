# Learning Hub

Local preview: `http://127.0.0.1:4319/?sample=sliding-window#learn`.
Normal site route: `/#learn`. Older `/#interview` links resolve to this tab.

Learning Hub complements the two coding tracks with a read-only reference page.
It adds no editor or Python runtime downloads.

## Content

- 21 ordered Python topics with concise explanations, runnable examples,
  outputs, one reminder and official documentation links.
- Desktop topic list, mobile dropdown and Previous/Next controls.
- 15 pattern-group illustrations in the library's recommended learning order,
  with recognition clues, key ideas and pitfalls. Each now has a three-step
  worked example with highlighted state snapshots and a short takeaway.
  Sliding Window is interactive; the other groups use compact concept diagrams.
- A compact Python fun-fact list and four executable quirk examples.
- Site themes, full-page scrolling, section jumps and practice-tab links.

The practice link opens the tab without selecting the illustrated pattern.
Topic selection survives tab switching, but not a page reload.

## Files and preservation

The headings are Learning Python, Leetcode Pattern Breakdowns and Python Quirks.
The navigation tab remains Learning Hub.
The intro and fun-fact list share an island at the same content width and card
radius as the practice pages. A small official-documentation link sits beside
the title and wraps below it on narrow screens. Quirk explanations introduce
the underlying concept before describing the gotcha.

The page, authored curriculum, worked examples and diagrams live in
`frontend/mockups/python-path/learning/`. Sources are Python's official tutorial,
library documentation, FAQ and uses page. Examples target Python 3.12.

`archives/interview-prep/` preserves the previous page, original recall interface,
authored content, references and local dependencies. It includes a portable JSON
snapshot and file size/SHA-256 manifest. Legacy source remains for compatibility
with old entry points/tests; the main third tab no longer imports it.

The archive contains authored curriculum, not personal browser answers. Browser
storage is untouched. A separate Interview Prep website still needs its own
entry point, dependencies, theme and hosting.

## Verification

Node tests cover topic IDs, source URLs, pattern coverage, archive hashes and JSON
snapshot integrity. The example verifier executes all 25 snippets and compares
actual/displayed output. Browser checks cover all selections, the interactive
window, mobile overflow, themes, old links, preserved practice/interview storage,
and cold loading without coding downloads. Frontend lint and the isolated sample
production build pass. Nothing was pushed or deployed.
