# SynLab

An online IDE for learning Python syntax through simple, practical exercises.
Designed for beginners who want to learn Pythonic Python fast.

Claude should treat this project as a production-quality learning platform, not a prototype or experimental playground.

## Project Structure
- `frontend/` — React (Vite) app, runs on port 3000
- `backend/` — Spring Boot REST API, runs on port 8080

## Running Locally
- Frontend: `cd frontend && npm install && npm run dev`
- Backend: `cd backend && ./mvnw spring-boot:run`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 (Vite), JSX |
| UI components | Material UI (MUI) |
| Code editor | Monaco Editor |
| Python execution | Pyodide (runs Python in the browser via WebAssembly) |
| Backend | Java 21, Spring Boot 3.5, Maven |
| Question storage | JSON file (future: PostgreSQL) |
| Progress storage | localStorage (future: user accounts) |

---

## Architecture Decisions

- Python code runs entirely in the browser via Pyodide — the backend never executes user code
- Questions are stored in `backend/src/main/resources/questions.json` and served via `GET /api/questions`
- User progress is stored in `localStorage` under the key `synlab_progress` as `{ questionId: boolean }`
- Components should accept an optional `user` prop where relevant to make adding auth easy later
- When PostgreSQL is added, swap the JSON file for a JPA repository without changing controller signatures

---

## AI Editing Rules

When modifying the codebase:

- Prefer modifying existing files rather than creating new ones
- Do not introduce new dependencies unless absolutely necessary
- Do not restructure large portions of the codebase unless explicitly asked
- Do not rename files or folders unless required
- When modifying logic, briefly explain the reasoning before making the change
- Preserve the existing project structure and conventions
- Avoid speculative improvements or unrelated refactoring
- Prefer small, incremental changes

---

## Code Quality Guidelines

All code written in this project should follow these principles:

- Clean Code
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- SOLID design principles where applicable

Additional guidelines:

- Favor readability and maintainability over clever or condensed code
- Prefer clear, descriptive names for variables, functions, and classes
- Keep functions and classes small and focused
- Avoid unnecessary abstraction

---

## Naming Conventions

Use consistent naming conventions across the project:

- Variables: `camelCase`
- Functions / methods: `camelCase`
- React components: `PascalCase`
- Java classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- File names for React components: `PascalCase`

---

## Change Philosophy

When making changes:

1. Identify the minimal change required to solve the problem
2. Implement the change clearly and predictably
3. Avoid unrelated refactoring
4. Preserve existing architecture and conventions
5. Briefly explain what changed and why

---

## Testing

- Do not introduce testing frameworks unless explicitly requested
- When modifying logic, ensure existing functionality remains unchanged
- Prefer minimal, targeted fixes rather than large rewrites

---

## Performance Considerations

- Avoid unnecessary React re-renders
- Use memoization (`useMemo`, `useCallback`) where it improves performance
- Avoid introducing unnecessary state
- Keep component logic simple and predictable
- Python execution via Pyodide must remain entirely client-side

---

## Security Model

User-submitted Python code runs exclusively in the browser via Pyodide.

The backend must never execute, evaluate, or run user-submitted code under any circumstances.

---

## Frontend Conventions

### Styling
- Use Material UI (MUI) components exclusively — do not use raw HTML elements where an MUI equivalent exists
- Use the MUI `sx` prop for all component-level styling — no external CSS files unless absolutely necessary
- If a raw HTML element or external CSS becomes necessary, leave a comment explaining why

### Theming
- MUI ThemeProvider wraps the entire app with a `mode` state (`'dark'` | `'light'`)
- Dark/light mode toggle button is always visible in the UI header
- Monaco Editor theme mirrors the app theme: dark mode → `vs-dark`, light mode → `light`

### Layout
- The app is a centered floating island card, 70–80% screen width, not full screen
- Split pane layout:
  - **Left panel:** question list with checkboxes + question prompt + Show Answer button + feedback output
  - **Right panel:** Monaco Editor + Run button
- Question list is always visible — not hidden behind a drawer or menu
- Run button executes code on click only — no auto-run, no keyboard shortcut

### Component Rules
- Functional components only — no class components
- Hooks only — `useState`, `useContext`, `useEffect`, `useMemo`, `useCallback`
- One component per file
- File names: PascalCase (e.g. `QuestionPanel.jsx`)
- File extension: `.jsx` for all React components

### Imports
- Use absolute imports with the `@` alias pointing to `src/`
- Example: `import QuestionPanel from '@/components/QuestionPanel'`
- Never use deep relative paths like `../../components/...`

### Folder Structure (`frontend/src/`)
```
components/    — reusable UI components
hooks/         — custom React hooks
pages/         — top-level page components
utils/         — pure helper functions
context/       — React context providers
```

### Progress & Questions
- Question completion stored in localStorage — a question is marked complete when all its tests pass
- Questions are grouped by topic with a recommended order (easy → hard)
- Users can open any question freely regardless of order

---

## Backend Conventions

### Language & Framework
- Java 21 — use modern features where they improve clarity: records, text blocks, pattern matching, sealed classes
- Spring Boot 3.5
- No Lombok — write standard verbose Java

### Code Style
- Follow SOLID and DRY principles throughout
- Modular, maintainable structure — each class has one clear responsibility
- Long, descriptive variable and method names for anything non-trivial
- Verbose, human-readable code is preferred over clever one-liners
- No comments unless the logic is genuinely non-obvious

### Package Structure (`com.synlab.backend`)
```
controller/    — REST controllers (thin, no business logic)
service/       — business logic (add when needed)
repository/    — data access (add when PostgreSQL is introduced)
model/         — Java records for data models and API responses
config/        — Spring configuration classes
exception/     — global exception handling
```

### REST API
- All endpoints prefixed with `/api`
- CORS configured for `http://localhost:3000` only
- Controllers delegate to services — no logic inside controller methods
- Return `ResponseEntity<T>` from all controller methods

### Error Handling
- Global `@ControllerAdvice` handles all exceptions
- All error responses use the `ErrorResponse` record: `{ status, message, timestamp }`
- Never let raw Spring error pages reach the client

---

## Question Format

Each question in `backend/src/main/resources/questions.json` has:

| Field | Type | Description |
|---|---|---|
| `id` | int | Unique identifier |
| `group` | string | Topic group (e.g. "Data Structures") |
| `order` | int | Recommended completion order |
| `title` | string | Short display name |
| `prompt` | string | Full question description shown to the user |
| `starterCode` | string | Pre-filled code shown in the editor |
| `tests` | string[] | Python assert statements run after user code |
| `answer` | string | Correct solution shown when user clicks Show Answer |
| `pythonicTip` | string | One sentence on the idiomatic Pythonic approach |
