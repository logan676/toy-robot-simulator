import express from 'express';
import cors from 'cors';
import { Simulator } from './services/Simulator';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store simulators per session (in production, use proper session management)
const simulators = new Map<string, Simulator>();

function getOrCreateSimulator(sessionId: string): Simulator {
  if (!simulators.has(sessionId)) {
    simulators.set(sessionId, new Simulator());
  }
  return simulators.get(sessionId)!;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get current state
app.get('/api/state', (req, res) => {
  const sessionId = (req.query.sessionId as string) || 'default';
  const simulator = getOrCreateSimulator(sessionId);
  res.json({
    state: simulator.getState(),
    table: simulator.getTableDimensions(),
    history: simulator.getHistory(),
  });
});

// Execute a single command
app.post('/api/command', (req, res) => {
  const { command, sessionId = 'default' } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Command is required' });
  }

  const simulator = getOrCreateSimulator(sessionId);
  const result = simulator.executeCommand(command);

  res.json({
    result,
    history: simulator.getHistory(),
  });
});

// Execute multiple commands (batch)
app.post('/api/commands', (req, res) => {
  const { commands, sessionId = 'default' } = req.body;

  if (!commands || typeof commands !== 'string') {
    return res.status(400).json({ error: 'Commands string is required' });
  }

  const simulator = getOrCreateSimulator(sessionId);
  const results = simulator.executeMultiple(commands);

  res.json({
    results,
    finalState: simulator.getState(),
    history: simulator.getHistory(),
  });
});

// Reset simulator
app.post('/api/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  const simulator = getOrCreateSimulator(sessionId);
  simulator.reset();

  res.json({
    state: simulator.getState(),
    message: 'Simulator reset successfully',
  });
});

app.listen(PORT, () => {
  console.log(`Toy Robot API server running on http://localhost:${PORT}`);
});
