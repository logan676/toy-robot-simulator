import { ApiState, CommandResponse } from '../types';

const API_BASE = 'http://localhost:3001/api';
const SESSION_ID = 'default';

export async function getState(): Promise<ApiState> {
  const response = await fetch(`${API_BASE}/state?sessionId=${SESSION_ID}`);
  if (!response.ok) {
    throw new Error('Failed to fetch state');
  }
  return response.json();
}

export async function executeCommand(command: string): Promise<CommandResponse> {
  const response = await fetch(`${API_BASE}/command`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command, sessionId: SESSION_ID }),
  });
  if (!response.ok) {
    throw new Error('Failed to execute command');
  }
  return response.json();
}

export async function executeCommands(commands: string): Promise<{
  results: CommandResponse['result'][];
  finalState: ApiState['state'];
  history: ApiState['history'];
}> {
  const response = await fetch(`${API_BASE}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commands, sessionId: SESSION_ID }),
  });
  if (!response.ok) {
    throw new Error('Failed to execute commands');
  }
  return response.json();
}

export async function resetSimulator(): Promise<{ state: ApiState['state']; message: string }> {
  const response = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId: SESSION_ID }),
  });
  if (!response.ok) {
    throw new Error('Failed to reset simulator');
  }
  return response.json();
}
