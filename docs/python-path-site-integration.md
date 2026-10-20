# Python Path and Interview prep: site integration

## Integrated behavior

The normal frontend entry point renders shared site navigation with three tabs:

| URL fragment | Section | Content/runtime dependency |
| --- | --- | --- |
| `/` or `/#practice` | Original practice | Existing questions API and browser Pyodide |
| `/#python` | Python Path | Bundled lessons; Pyodide browser worker |
| `/#interview` | Interview prep | Bundled notes/drills; no API or Python runtime required |

`App` retains the existing theme/progress providers. `SitePage` lazy-loads each
section and keeps visited panels mounted to preserve unsaved editor state when
switching. Per-section error boundaries keep navigation usable after a failure.
The new sections preserve their reviewed dark editor appearance through a scoped
theme. Original practice keeps its existing light/dark toggle and layout.

The shared Monaco setup uses the installed editor API, Python syntax and a bundled
editor worker. It configures the same loader for original and new editors, avoiding
separate editor runtime configurations. No packages or lockfile changes are needed.
Automatic matching-word occurrence highlighting is disabled in all three editors:
Monaco's upstream issue [#5294](https://github.com/microsoft/monaco-editor/issues/5294)
caused an unhandled cancellation during model/file changes. A production stack
trace mapped to `wordHighlighter.js` confirmed the source. Syntax coloring,
editing, execution and file navigation remain available; errors are not globally
suppressed.

The production build imports the completed components through `@practice`. Their
current folder name is retained to avoid a source migration during integration;
`main.jsx` and `serve.mjs` in that folder remain optional standalone preview tools.
The Vercel build uses the normal `frontend/package.json` build command, not that
standalone preview configuration. The runtime curriculum JSON lives inside
`frontend/` so a deployment rooted there includes it. The content inventory check
asserts it equals the original design manifest in `docs/`.

## Data and privacy

Original practice retains `synlab_progress` and `synlab_code`. New sections use
`synlab_python_path_v1` and `synlab_interview_recall_v1`; no migration/reset of
existing progress is performed. Browser storage is origin-specific: export from
the local preview and import on the deployed site to carry practice data across.

The supplied PDF, career guide and private stories are not bundled or served.
Public study modules contain reusable technical notes, generic coaching prompts
and references. Responses stay in local browser storage; no grading/model API
is added. Existing Sentry initialization remains in the site entry point.

## Validation

From the repository root:

```powershell
node frontend/mockups/python-path/tests/export-content.mjs
node --test frontend/mockups/python-path/tests/progress.test.mjs frontend/mockups/python-path/tests/interview.test.mjs frontend/mockups/python-path/tests/site-navigation.test.mjs
```

Then build and serve the actual frontend:

```powershell
cd frontend
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4316 --strictPort
```

In another terminal at the repository root:

```powershell
node frontend/mockups/python-path/tests/verify-production.mjs
```

This checks production assets, direct links, tab switching, original/new code
execution, independent storage, API-failure navigation, mobile layout, every one
of the 208 authored reference solutions in the compiled worker, and the full
interview recall workflow. The browser helper uses an existing local Playwright
installation; set `PLAYWRIGHT_PACKAGE` to another installation when needed.

## Publishing

The existing production workflow triggers on `main`; staging triggers on
`develop`. Both deploy the frontend to Vercel and also run the existing Railway
backend deployment. This integration changes no backend files. The frontend
deploy steps now pin Vercel CLI 47.2.2 (the minimum required by the endpoint) and
use `--yes` for CI, after staging rejected the action's default CLI 25.1.0.
Production source at `69a1b86` has the same frontend/backend baseline as this
feature branch's `6e9a85b` starting point; checked against GitHub on 2026-10-20.

Release through the existing feature → develop → main PR flow after checks. A
GitHub push needs explicit authorization under the user's standing rule. Local
integration/build success does not mean the change is online. Confirm workflow
success and test the public `/#python` and `/#interview` links after deployment.

Known build warnings: the Monaco editor chunk remains large; source maps are not
uploaded to Sentry when its build token is absent locally. Initial coding runtime
loads require jsDelivr. Learning behavior, account sync and broader UI redesign
are outside this integration change.

Validation completed on 2026-10-20: normal frontend production build passes;
12 Node checks pass; content inventory verifies all 208 lessons and the curriculum
mirror. The compiled production browser run passes site navigation and API-failure
checks, all 208 reference solutions plus Python editor/file/backup flows, and the
full Interview prep workflow. No unhandled browser errors remain in these runs.
Publishing is pending the explicitly authorized GitHub push/release promotion.
