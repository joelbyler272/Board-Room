# Board Room

An EOS-based business operating system where the CEO interacts with AI department heads powered by Claude API.

## Features

- **AI Department Heads**: Chat with intelligent agents representing each department (Editorial, Research, Growth, Monetization, Finance)
- **Scorecard**: Track key metrics across departments with on/off track status
- **Rocks**: Manage quarterly goals (rocks) with progress tracking
- **Issues (IDS)**: Identify, Discuss, and Solve issues using the EOS methodology
- **To-Dos**: Track action items with due dates and completion status
- **Decision Log**: Record decisions for future reference
- **L10 Meetings**: Guided Level 10 meeting flow with all sections
- **V/TO**: Vision/Traction Organizer with company vision and goals

## Tech Stack

- **Backend**: Node.js + Express + SQLite (better-sqlite3)
- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **AI**: Claude API via @anthropic-ai/sdk
- **State Management**: React Context + TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key (get one at https://console.anthropic.com)

### Installation

1. Clone the repository:
```bash
cd board-room
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

4. Seed the database:
```bash
npm run seed
```

5. Start the backend:
```bash
npm run dev
```

6. In a new terminal, install frontend dependencies:
```bash
cd frontend
npm install
```

7. Start the frontend:
```bash
npm run dev
```

8. Open http://localhost:5173 in your browser

## Project Structure

```
board-room/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.sql      # Database schema
│   │   │   ├── seed.js         # Seed data
│   │   │   └── index.js        # Database connection
│   │   ├── routes/             # API routes
│   │   ├── services/
│   │   │   └── claude.js       # Claude API integration
│   │   └── index.js            # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── api/                # API client
│   │   ├── context/            # React context
│   │   └── App.jsx             # Router setup
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/companies | List/create companies |
| GET/PUT | /api/companies/:id | Get/update company |
| GET/POST | /api/departments | List/create departments |
| GET | /api/departments/:id | Get department with related data |
| POST | /api/departments/:id/chat | Chat with department agent |
| GET/POST | /api/rocks | List/create rocks |
| GET/PUT | /api/rocks/:id | Get/update rock |
| GET/POST | /api/issues | List/create issues |
| GET/PUT | /api/issues/:id | Get/update issue |
| POST | /api/issues/:id/ids | Run IDS flow with agent |
| GET/POST | /api/todos | List/create todos |
| PUT | /api/todos/:id | Update todo |
| POST | /api/todos/:id/toggle | Toggle todo status |
| GET/POST | /api/decisions | List/create decisions |
| GET | /api/messages/inbox | Get inbox messages |
| GET/POST | /api/metrics | List/create metrics |
| PUT | /api/metrics/:id | Update metric |
| POST | /api/meetings/l10/start | Start L10 meeting |
| POST | /api/meetings/:id/section | Process meeting section |

## Seed Data

The seed script creates a sample company "Career Capital" with:
- 5 departments with detailed system prompts
- 10 quarterly rocks
- 12 scorecard metrics
- 3 open issues
- 4 pending to-dos
- Welcome messages from each department

## Department Agents

Each department has a custom system prompt that defines:
- Role and responsibilities
- Key metrics they own
- Current rocks
- Communication style
- Reporting cadence

Agents can:
- Answer questions about their domain
- Surface issues (prefixed with `ISSUE:`)
- Create to-dos (prefixed with `TODO:`)
- Send reports, requests, updates, and alerts

## License

MIT
