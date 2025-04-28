# Chess Game Web Application

A real-time multiplayer chess application that allows users to play chess with others online without registration. Built with React, TypeScript, WebSockets, and Chess.js.

## Features

- Real-time multiplayer gameplay using WebSockets
- Complete chess rule implementation (castling, en passant, checkmate detection, etc.)
- Responsive design that works on desktop and mobile devices
- No registration required - instant gameplay
- Move validation and highlighting of possible moves
- Game status updates and move history

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for build and development
- React Router for navigation
- Chess.js for chess logic

### Backend
- Node.js with TypeScript
- WebSocket server (ws package)
- Chess.js for move validation

## Project Structure

```
chess/
├── backend/               # Backend WebSocket server
│   ├── src/
│   │   ├── Game.ts        # Game class for chess logic
│   │   ├── GameManager.ts # Manages active games and users
│   │   ├── index.ts       # WebSocket server entry point
│   │   └── messages.ts    # Message type constants
│   ├── dist/              # Compiled TypeScript
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/              # React frontend application
    ├── public/            # Static assets (chess piece images)
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── hooks/         # Custom React hooks
    │   ├── screens/       # Page components
    │   ├── App.tsx        # Main application component
    │   └── index.css      # Global styles
    ├── package.json
    └── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dharmik2901/chess.git
cd chess
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npx tsc
node dist/index.js
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Open the application in your browser
2. Click on "Start Playing Now" on the landing page
3. Click "Play Now" to find an opponent
4. Wait for another player to join
5. When the game starts, white moves first
6. Click on a piece to select it, then click on a destination square to move
7. Valid moves will be highlighted with blue indicators
8. The game ends when there's a checkmate or draw

## Acknowledgments

- [Chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
