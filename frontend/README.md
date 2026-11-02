# SyntaxLab frontend

React 19/Vite application with Python Basics, guided Blind 75 practice and a
Learning Hub. Monaco supplies the editor and Pyodide runs Python in a browser
worker. The active curriculum is bundled with the frontend; the Spring Boot API
serves the retained legacy question bank.

## Development

Use Node.js 20.19+ or 22.12+. From this directory:

```text
npm ci
npm run dev
```

Vite serves on port 3000. `.env.example` documents optional backend/Sentry
settings; do not commit real credentials. Learning Hub and the current bundled
curriculum do not depend on the legacy questions API. Python's first coding
load requires access to its CDN.

```text
npm run lint
npm run build
npm run preview
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Source map

- `src/pages/SitePage.jsx`: hash navigation, lazy section loading and recovery.
- `src/context/ThemeContext.jsx`: site theme; light initially, Graphite dark.
- `src/utils/darkPreview.js`: shared dark palette and explicit color comparisons.
- `mockups/python-path/`: production learning workspace, curriculum, editor,
  browser worker, progress ownership and Learning Hub. The directory name is
  historical; production imports these components through `@practice`.
- `../archives/interview-prep/`: preserved earlier reference/recall content.

The editor's light/dark control remains independent of the site toggle. Drafts
and progress stay in browser-local storage; supported backup export/import is
needed to transfer them between origins/devices.

See the [workspace guide](mockups/python-path/README.md) for content and browser
checks, [architecture](../ARCHITECTURE.md) for system boundaries, and
[release status](../docs/release-status.md) for deployment records. Staging
publishes from `develop`; production publishes from `main` through the repository
workflows. Local build success alone does not establish a deployed release.
