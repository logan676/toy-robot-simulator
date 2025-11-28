# Toy Robot Simulator

A simulation of a toy robot moving on a 5x5 tabletop, built with TypeScript, Node.js (Express), and React.

## Original Challenge

See [CHALLENGE.md](CHALLENGE.md) for the original problem description.

## Project Structure

```
toy-robot-simulator/
├── backend/           # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── models/    # Robot, Table classes
│   │   ├── services/  # CommandParser, Simulator
│   │   └── index.ts   # Express server
│   └── package.json
├── frontend/          # React + TypeScript UI
│   ├── src/
│   │   ├── components/  # TableGrid, CommandInput, History
│   │   ├── api/         # API client
│   │   └── types/       # TypeScript interfaces
│   └── package.json
└── test-data/         # Example input files
```

## Requirements

- Node.js >= 18
- npm

## Installation & Running

### Backend

```bash
cd backend
npm install
npm run dev
```

The API server will start on http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app will start on http://localhost:3000

## Running Tests

```bash
cd backend
npm test
```

All 41 tests should pass.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/state` | Get current robot state |
| POST | `/api/command` | Execute a single command |
| POST | `/api/commands` | Execute multiple commands (batch) |
| POST | `/api/reset` | Reset the simulator |

## Commands

| Command | Description |
|---------|-------------|
| `PLACE X,Y,F` | Place robot at (X,Y) facing direction F (NORTH/SOUTH/EAST/WEST) |
| `MOVE` | Move one unit forward in current direction |
| `LEFT` | Rotate 90° counter-clockwise |
| `RIGHT` | Rotate 90° clockwise |
| `REPORT` | Output current position and direction |

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript
- **Testing**: Jest

## Design Decisions

1. **Separation of Concerns**: Robot logic is separated from the Table (boundary validation) and Simulator (orchestration)
2. **Immutable Commands**: CommandParser produces immutable command objects
3. **Session Support**: API supports multiple sessions for concurrent users
4. **Visual Feedback**: Frontend provides real-time visualization of robot position and command history
