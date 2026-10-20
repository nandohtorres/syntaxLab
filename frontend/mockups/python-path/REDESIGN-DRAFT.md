# SyntaxLab visual rework draft

Open http://127.0.0.1:4315/redesign.html while the existing `serve.mjs` preview
server is running. This is a separate HTML entry; it does not replace the
production frontend or the Python Path preview.

The desktop layout retains the original question library above the prompt on
the left and the code editor on the right. Navy surfaces, mint accents, editor
theme, typography and feedback styling come from Python Path. Desktop uses one
viewport-sized floating panel, with internal library, prompt and editor scrolling.
Native and Monaco scrollbars use slate tracks/thumbs and mint hover accents.
Mobile stacks the library, prompt and editor. Windows shorter than 640px retain
document scrolling so controls remain reachable.

Six independently authored sample exercises demonstrate selection, retained
edits, hints, worked solutions, real browser-only Python checks, reset,
completion indicators and next-rep navigation. Draft progress stays in React
memory for this visit. It does not read or write the main site's progress.
Python Path and Interview prep links open their existing standalone sections.

This is for design review before a full rebuild. It does not yet migrate the
original question bank, persistence, light theme, or resizable panes. First
runtime loading requires access to the existing Pyodide CDN.

Validation: Chromium desktop 1440 × 1000 and mobile 390 × 844; real Python
syntax failure and successful greeting; hints, solutions, next rep, exercise
switching with retained edits, reset; no horizontal mobile overflow or browser
page errors. The first check was blocked by preview dependency access; restarting
the preview with approved access resolved it. Two smoke assertions were corrected
to match syntax feedback and the completed-row checkmark. Final check passed.

Screenshots: `redesign-feedback.png` and `redesign-mobile.png`.
Follow-up layout checks passed at 1440 × 900, 1280 × 720, 1024 × 640 and
1920 × 1080: no document overflow with an expanded solution, Run/retry controls
remain in view, and the prompt scrolls internally. Mobile 390 × 844 preserves
vertical scrolling without horizontal overflow; 1280 × 500 uses the short-window
fallback. No browser page errors. This focused layout check did not validate the
Python runtime download, which was unavailable in the sandbox browser session.

No production deployment or push was performed for this draft.
