# SyntaxLab

An online IDE for learning Python syntax through simple, practical exercises.
Designed for beginners who want to learn idiomatic Python fast.

🌐 **Live Demo:** _coming soon_

---

## Screenshot

_coming soon_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| UI Components | Material UI (MUI) |
| Code Editor | Monaco Editor |
| Python Execution | Pyodide (WebAssembly — runs entirely in the browser) |
| Backend | Java 21, Spring Boot 3.5, Maven |
| Question Storage | JSON (PostgreSQL planned) |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Java 21
- Maven (or use the included `./mvnw` wrapper)

### 1. Clone the repo
```bash
git clone https://github.com/nandohtorres/syntaxLab.git
cd syntaxLab
```

### 2. Run the backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`

### 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`

---

## Environment Variables

Copy the example file and fill in your values:
```bash
cp frontend/.env.example frontend/.env.local
```

See `frontend/.env.example` for all required variables.

---

## Project Structure

```
syntaxLab/
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # React context providers
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Top-level page components
│       └── utils/        # Pure helper functions
└── backend/          # Spring Boot REST API
    └── src/main/
        ├── java/com/synlab/backend/
        │   ├── config/       # Spring configuration
        │   ├── controller/   # REST controllers
        │   ├── exception/    # Global error handling
        │   └── model/        # Java records
        └── resources/
            └── questions.json  # Question bank (30 questions)
```

---

## License

[MIT](./LICENSE)
