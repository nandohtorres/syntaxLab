# Mobile code drawer and editor migration

Plan for making SyntaxLab comfortable on phones before it is shared
publicly. The editor decision behind it is
[ADR 0001](decisions/0001-codemirror-editor.md).

## Goal

On a phone, a learner can do three things:

- read the question and pattern breakdown as one comfortable page
- type real Python without fighting the editor
- run it

Desktop keeps its current layout.

## Chosen layout: code drawer

Chosen by the owner from three phone mockups on 2026-11-10: tabs, code
drawer, and guided steps.

**Applies under 900px wide**, to Python Basics, LeetCode Patterns and Rapid
Fire.

- **The page:** question, pattern breakdown, tip and feedback scroll as one
  normal page.
- **Questions list:** opens from a menu button instead of sitting under the
  editor.
- **The drawer:** the editor sits in a drawer docked to the bottom of the
  screen.
  - **Drag:** drag the handle up or down to any height. It stops at a
    minimum peek height and a maximum of about 90% of the screen.
  - **Lock:** freezes the drawer at its current height, so scrolling or a
    stray drag can't move it.
  - **Reset:** puts the drawer back to its default height and unlocks it.
    This is the escape hatch if a phone's browser bars or keyboard push the
    drawer somewhere unusable. It stays reachable at every height.
  - **Remembered:** height and lock state are saved in this browser under
    `synlab_code_drawer_v1`.
- **Symbol keys:** a row above the editor (`:` `(` `)` `[` `]` `=` `,` tab,
  and so on), because phone keyboards hide these symbols.
- **Run:** Run / Next stay inside the drawer.
- **Rapid Fire:** the task, tip, example and data bubbles are the page. The
  drawer holds the editor, symbol keys and a visible **Submit** button, so
  phones never depend on the Enter key.

**Section titles:** displayed in Title Case (done 2026-11-10). This is
display-only CSS, so accessible names and tests are unchanged.

## Stages

Each stage ends green: lint, build, and the browser checks for what changed.
Everything stays on `feat/rapid-fire-mode`, committed only when the owner
says so.

1. **`CodeSurface` wrapper on CodeMirror 6.** One component that every page
   uses.
   - **Props:** value, onChange, language, readOnly, ariaLabel, a dark or
     light theme matching today's Monaco colors, and extra key bindings.
   - **Ref:** focus, plus insert text (used by the symbol keys).
   - **Python behavior:** 4-space indent and auto-indent after a colon.
2. **Look review (owner gate).** A desktop side-by-side of Monaco and
   CodeSurface. Desktop does not switch until the owner approves.
3. **Switch the live editors.**
   - `ExerciseEditor.jsx`: Ctrl+Enter runs, Ctrl+Shift+Enter goes to the
     next question, read-only while running.
   - `RapidFireMode.jsx`: Enter submits or adds a new line, plus its own
     indent handling.
   - Browser tests move from `.monaco-editor` selectors to CodeMirror's.
4. **Phone drawer.** The layout above, in `StudyWorkspace` and Rapid Fire.
   - It is checked at 390px and 768px widths.
   - The owner checks it on a real phone, including paste (roadmap items P
     and X).
5. **Cleanup and docs.**
   - Remove Monaco from the live bundle and confirm the size drop.
   - Run `npm audit` on the `dompurify` override.
   - Update `ARCHITECTURE.md`, `CLAUDE.md` and the roadmap.

## Status (2026-11-10)

- **Stages 1-5 built:**
  - Stage 2 review: the owner approved the look after adding indent guides
    and keyword-colored built-ins. Bracket-pair tints were skipped.
  - Stage 3: the largest JS chunk dropped from about 3.7 MB to about 0.5 MB.
- **Checks passed:**
  - Lint, build, and 35 of 35 Node tests.
  - Browser checks in the production preview:
    - desktop practice run with Ctrl+Enter
    - Rapid Fire multi-line rep with Enter and auto-indent
    - phone-width drawer: drag, clamp to peek and max, lock, reset, tap to
      fold, height remembered after reload
    - symbol key insert, Questions list open and close, running code in the
      drawer
    - Rapid Fire on a phone with Submit
    - desktop unchanged
  - 10 Playwright browser scripts were moved to CodeMirror selectors.
    Playwright isn't installed on this machine, so they were not run.
- **Still open:**
  - A real-phone check of typing and paste (roadmap items P and X).
  - The legacy Monaco users listed below.

## Out of scope

These need their own decision:

- The retained legacy `MainPage` / `src/components/CodeEditor.jsx`, which is
  not routed in the app. It keeps Monaco until it is migrated or removed.
- The archived interview practice and `RedesignDraft` mockups.
- Any desktop layout change.

## Principles followed

- **One seam:** pages depend on `CodeSurface`, never on an editor library.
  The editor can change again without touching pages.
- **Smallest change per stage:** no speculative features, and existing
  behavior keeps working (shortcuts, read-only while running, theme toggle).
- **Every stage is checked:** lint, build and browser checks before the next
  stage starts.
- **Decisions are written down:** in the ADR, with the why.
