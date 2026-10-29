# Blind 75 pattern-browser preview

Current status (2026-10-28): see [the completed curriculum review](curriculum-audit.md).
The notes below preserve the earlier plan or sample review; counts and pending
items describe that stage. The approved island and all 75 guided questions are
now available on the normal local route. Nothing has been published.

Local review: http://127.0.0.1:4319/?sample=sliding-window

The LeetCode library has exactly 75 canonical problem entries. Pattern groups
expand to their questions, using titles and assignments from the existing Blind
75 manifest. There is no question search. Python Basics remains separate.

Sliding Window -> Longest Substring Without Repeating Characters -> a/b/c/d:

- a. Add the incoming character.
- b. Remove the duplicate.
- c. Combine the window logic.
- d. Solve the full problem using the canonical Solution method interface.

Supporting exercises belong inside the parent question and do not increase the
75-question library count. Other Blind 75 questions retain their existing full
runnable exercises; their detailed breakdowns have not been authored in this
sample. Previous custom fixed-window and at-most-k drafts remain recognized in
storage but are excluded from the visible question bank.

The chosen question panel shows the original problem first, then an outline-style
part dropdown and its selected task. See [the flow guide](question-parts-previews.md). Pattern names are prominent, and question titles/list
entries use the official LeetCode number.

Sections are Your task, Visual example, Why this works (reading, not a quiz), and
Code solution (optional worked code). Hint controls and the old Explain/brief
answer toggle are removed. The idle Python-ready label is gone; useful loading
and error statuses remain. Editor refresh is immediately left of its theme icon.
Automatic saving and the separate Basics curriculum remain intact.

All three site tabs now use the selected frosted-glass treatment with folder
shapes. The active tab merges directly into the original island surface; the inner
folder frame, tab borders, and separate panel fill are removed. Inactive tabs
keep a subtle translucent tint. Keyboard focus, reduced motion,
light/dark surfaces, and the default middle LeetCode tab remain supported.

Design references:

- [Material Web tabs](https://github.com/material-components/material-web/blob/main/docs/components/tabs.md)
- [Fluent acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic)
- [Canonical LeetCode problem](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

Build with `node frontend/scripts/build-layout-demos.mjs --sample`. The existing
preview server on 4319 serves `.cache/sliding-window-sample`. Earlier preview
origins retain separate browser storage. Nothing has been deployed.

Checks:

```powershell
node --test frontend/mockups/python-path/tests/blind75-practice.test.mjs
python -B frontend/mockups/python-path/tests/verify_blind75_practice.py
node frontend/mockups/python-path/tests/sliding-window-browser.mjs
```

The browser probe uses the existing workstation Playwright package, overrideable
with PLAYWRIGHT_PACKAGE. Reference solutions are checked against authored cases;
passing them does not certify conceptual mastery or optimal complexity.

## Editor actions (2026-10-28)

Run code executes the authored checks and records a passing attempt. The adjacent
text Skip question action moves past the parent question without credit; in
Python Basics it is Skip exercise. After a pass, the same action becomes the
primary Next part / Next question / Next exercise button. Editing clears the
current pass and restores Skip until the edited code passes again. Previously
earned progress remains saved, and repeated runs do not double-credit a visit.
The separate Skip-for-now footer and disabled outlined Next button are removed.

References: LeetCode separates Run from Submit
(https://support.leetcode.com/hc/en-us/articles/360012016874-Start-your-Coding-Practice).
freeCodeCamp uses a successful-check/continue flow
(https://github.com/freeCodeCamp/freeCodeCamp/issues/63070).
Syntax Lab uses one check-and-credit action because Run already validates the
whole authored exercise; a second Submit action would repeat that step.
