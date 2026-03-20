# Contributing to SyntaxLab

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
