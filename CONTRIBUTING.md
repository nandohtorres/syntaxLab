# Contributing to SyntaxLab

## Local verification

Use Node.js 20.19+ or 22.12+ and install frontend dependencies with `npm ci`
in `frontend/`, using its tracked lockfile. Run:

```text
npm run lint --prefix frontend
node --test frontend/mockups/python-path/tests/*.test.mjs
npm run build --prefix frontend
```

The [workspace guide](frontend/mockups/python-path/README.md) lists curriculum,
native Python and compiled-browser checks. The [release record](docs/release-status.md)
distinguishes shipped features from pending changes. Do not infer model or learning
accuracy, full accessibility, or complete user-flow verification from a successful build.

## Branch Strategy

- `main` — production only, never push directly
- `develop` — staging, base branch for all work

## Branch Naming

| Type | Format | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/add-loops-questions` |
| Bug fix | `fix/short-description` | `fix/editor-crash-on-empty-code` |
| Chore | `chore/short-description` | `chore/update-dependencies` |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(questions): add 5 new algorithm questions
fix(editor): prevent crash on empty code submission
chore(deps): update vite to 5.2.0
```

## Pull Requests

- Always target `develop`, never `main`
- Keep PRs small and focused — one feature or fix per PR
- PRs to `main` are for production releases only (merge from `develop`)
