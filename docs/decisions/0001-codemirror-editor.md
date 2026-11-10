# 0001. Replace Monaco with CodeMirror 6 on every screen

- **Status:** Accepted
- **Date:** 2026-11-10
- **Decided by:** Fernando (owner)
- **Plan:** [Mobile code drawer and editor migration](../mobile-code-drawer-plan.md)
- **Implemented:** 2026-11-10, in `CodeSurface.jsx`. The owner reviewed it side by side and asked for Monaco-style indent guides and built-in coloring, which were added.

## Context

SyntaxLab is about to be shared publicly, and a phone check showed the
practice pages are hard to use on a phone. Reading questions is cramped, and
typing code is unreliable.

The editor is the root of the typing problem:

- Monaco's own README and site say it is **not supported in mobile
  browsers**.
- Two open roadmap bugs come from Monaco's input handling: right-click paste
  (`AiFeedback/PUBLISH_ROADMAP.md` item P) and long-press paste on mobile
  (item X).
- Monaco is the largest part of the frontend download. The biggest
  production JS chunk is about 3.7 MB, mostly Monaco.
- Monaco also pulls in the vulnerable DOMPurify version that
  `frontend/package.json` pins with an `overrides` entry.

SyntaxLab uses very little of Monaco:

- two custom themes
- Python syntax highlighting
- key handlers (Ctrl+Enter to run, and Rapid Fire's Enter-to-submit and
  auto-indent)
- reading the value and focusing the editor

Suggestions, IntelliSense and the minimap are all turned off.

## Decision

Use **CodeMirror 6** (`@uiw/react-codemirror` + `@codemirror/lang-python`) as
the one editor on phones, tablets and desktop. Its theme matches the current
Monaco colors, font and line numbers.

All editor use goes through one wrapper component, `CodeSurface`. Pages never
import an editor library directly.

## Alternatives considered

1. **Keep Monaco everywhere.**
   - **Pro:** no new dependency.
   - **Con:** typing on phones stays unsupported, so the mobile redesign
     would sit on an editor that officially does not work there.
   - Rejected.
2. **CodeMirror on phones, Monaco on desktop.**
   - **Pro:** desktop keeps the exact Monaco look.
   - **Con:** two editors to build, theme, test and fix, with a solo
     maintainer.
   - Replit ran exactly this split, Monaco on desktop and CodeMirror on
     mobile, and later moved desktop to CodeMirror too for one consistent
     experience and faster fixes.
   - Rejected as the end state. It stays available as a fallback: with the
     `CodeSurface` wrapper, desktop could go back to Monaco without touching
     any page.
3. **CodeMirror everywhere.** Chosen.

## Why

- **Works on phones:** CodeMirror 6 was built with touchscreen and mobile
  support as a goal. Replit adopted it for that reason.
- **One editor:** every fix and feature is written once, and learners get the
  same editor on phone and laptop.
- **Cheap to switch:** the switch is small for SyntaxLab because none of
  Monaco's heavy features are used. Replit and Sourcegraph found their
  migrations expensive because they used those heavy features; SyntaxLab
  doesn't.
- **Smaller download:** about 3.7 MB of editor code drops to roughly 100-200
  KB, so every page loads faster.
- **Likely fixes items P and X:** CodeMirror edits through the browser's
  native editing, so the native paste and long-press menus should work. This
  must be confirmed on a real phone before P and X are closed.

## Consequences

- **The look changes slightly:**
  - Desktop loses the exact Monaco look.
  - Colors, font, size and line numbers are matched.
  - The cursor, selection and gutter details differ slightly.
  - The owner reviews a side-by-side comparison before desktop switches.
- **New dependencies:** `@uiw/react-codemirror`, `@codemirror/lang-python`
  and their CodeMirror packages.
- **Rewrites:** Rapid Fire's Enter-to-submit and auto-indent handlers are
  rewritten as CodeMirror keymaps.
- **Tests:** browser tests that type into `.monaco-editor` must target
  CodeMirror's `.cm-content` instead.
- **Cleanup after the switch:**
  - Monaco, `editorRuntime.js`, the Monaco worker and the `.iPadShowKeyboard`
    CSS fix are removed.
  - The `dompurify` override is re-checked with `npm audit` and removed if no
    longer needed.
- **Docs:** `CLAUDE.md` and `ARCHITECTURE.md` are updated when the switch
  ships.

## Sources

- [Monaco Editor official site](https://microsoft.github.io/monaco-editor) (no
  mobile browser support)
- [Replit: Ace, CodeMirror, and Monaco compared](https://replit.com/blog/code-editors)
- [Replit: A New Code Editor for Mobile](https://replit.com/blog/codemirror-mobile)
- [Replit: Betting on CodeMirror](https://replit.com/blog/codemirror)
- [Sourcegraph: Migrating from Monaco to CodeMirror](https://sourcegraph.com/blog/migrating-monaco-codemirror)
- [NN/g: Mobile vs. Responsive](https://www.nngroup.com/articles/mobile-vs-responsive/)
