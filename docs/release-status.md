# SyntaxLab release status

Updated November 2, 2026. This page records the original workspace deployment
and the Graphite release. Older planning documents retain their historical notes.

## Public release

- Production source: `36fb85f854c673fbc4880d349fbbc077f33ab8ea`, merged through
  [PR #15](https://github.com/nandohtorres/syntaxLab/pull/15) on October 29.
- [Production workflow](https://github.com/nandohtorres/syntaxLab/actions/runs/40928579943):
  both the Vercel frontend and Railway backend jobs succeeded.
- [Live app](https://syntaxlab.work) and
  [Vercel alternative](https://syntaxlab-lake.vercel.app).
- Python Basics: 98 core drills and six optional projects.
- LeetCode Patterns: 75 canonical questions with 162 graded parts, including
  preparation steps. Passing a preparation step does not complete its question.
- Learning Hub: 21 topics and visuals for 15 pattern groups. Old `#interview`
  links open the Hub; Interview Prep is archived, not a separate deployed site.

The normal site starts in light mode and uses the floating workspace. Python
runs in the browser with Pyodide; progress and drafts use browser-local storage.
No accounts, cloud progress sync or server-side Python execution are provided.

## Graphite release, November 2

This release makes Graphite the standard dark palette across the site, practice
panels and editor. It adds clearer folder tabs, sequential Basics numbers and
matched task typography. Light remains the initial default and editor/site
controls remain independent. Earlier Slate/Charcoal alternatives remain opt-in
comparisons. No exercise IDs, stored progress keys or backend behavior change.

The source also refreshes the README screenshots, architecture, release notes
and historical-document status headers. Publication follows the existing
feature -> develop -> main workflow. The current result is available in
[production Actions](https://github.com/nandohtorres/syntaxLab/actions/workflows/production.yml);
the October 29 run above establishes the earlier release, not this update.

With the local sample preview running on port 4319:

- [Graphite sample](http://127.0.0.1:4319/?dark=graphite&sample=sliding-window)
- [Graphite Basics](http://127.0.0.1:4319/?dark=graphite#python)
- [Graphite Learning Hub](http://127.0.0.1:4319/?dark=graphite#learn)

Graphite also works through the normal dark toggle without query parameters.
The [workspace guide](../frontend/mockups/python-path/README.md) contains build
and verification commands, including the normal-entry theme regression.

## Verification and practical limits

The October 29 deployment record includes real-browser checks of guided credit,
Stop recovery, celebration, storage/reload behavior, mobile/dark/reduced motion
and Learning Hub. The [curriculum audit](curriculum-audit.md) records the earlier
local content checks and their scope. These are dated checks, not a continuous
availability or accessibility guarantee.

On November 2, GitHub confirmed the production workflow and both jobs succeeded;
the custom-domain homepage also returned application HTML. Earlier custom-domain
checks encountered local network filtering. A successful HTTP fetch does not
replace a complete browser flow from the network/device used for a demonstration.

Practice tests are authored learning checks, not the full LeetCode judge or
proof of algorithmic optimality. First coding use downloads Pyodide from its
CDN. The Monaco bundle is large. Browser data is specific to its origin/device;
backup export/import is needed to transfer supported practice data. Learning Hub
loads without the editor, Python runtime or legacy question API.

## Sharing and maintenance

- For each release, run relevant checks and publish through feature -> develop
  -> main PRs. Both deployment jobs must pass.
- Verify Run, pass/Next, Stop/recovery, reload, backup and all three routes on
  the public release; check first-load behavior and keyboard use.
- [ ] Verify public contact, resume and portfolio links separately.
- [ ] Keep resume claims tied to demonstrated features and measured checks;
  avoid unmeasured user counts, learning gains, accuracy or production scale.

Release notes describe the source change; a successful production workflow and
deployed browser checks establish when it is ready to share.
