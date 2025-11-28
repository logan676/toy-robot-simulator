import React, { useState, useEffect, useCallback } from 'react';
import { TableGrid } from './components/TableGrid';
import { CommandInput } from './components/CommandInput';
import { History } from './components/History';
import { RobotState, ExecutionHistory, TableDimensions } from './types';
import * as api from './api/robotApi';
import './App.css';

function App() {
  const [robotState, setRobotState] = useState<RobotState>({
    x: null,
    y: null,
    direction: null,
    placed: false,
  });
  const [tableDimensions, setTableDimensions] = useState<TableDimensions>({
    width: 5,
    height: 5,
  });
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const state = await api.getState();
      setRobotState(state.state);
      setTableDimensions(state.table);
      setHistory(state.history);
      setError(null);
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running on port 3001.');
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const handleExecuteCommand = async (command: string) => {
    setLoading(true);
    try {
      const response = await api.executeCommand(command);
      setRobotState(response.result.state);
      setHistory(response.history);
      setError(null);
    } catch (err) {
      setError('Failed to execute command');
    }
    setLoading(false);
  };

  const handleExecuteBatch = async (commands: string) => {
    setLoading(true);
    try {
      const response = await api.executeCommands(commands);
      setRobotState(response.finalState);
      setHistory(response.history);
      setError(null);
    } catch (err) {
      setError('Failed to execute commands');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await api.resetSimulator();
      setRobotState(response.state);
      setHistory([]);
      setError(null);
    } catch (err) {
      setError('Failed to reset simulator');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Toy Robot Simulator</h1>
        <p>A 5x5 tabletop robot simulation</p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <main className="app-main">
        <div className="grid-section">
          <TableGrid
            robotState={robotState}
            width={tableDimensions.width}
            height={tableDimensions.height}
          />
          <div className="status">
            {robotState.placed ? (
              <span>
                Position: ({robotState.x}, {robotState.y}) facing {robotState.direction}
              </span>
            ) : (
              <span>Robot not placed. Use PLACE X,Y,F to start.</span>
            )}
          </div>
        </div>

        <div className="controls-section">
          <CommandInput
            onExecuteCommand={handleExecuteCommand}
            onExecuteBatch={handleExecuteBatch}
            onReset={handleReset}
            disabled={loading}
          />
          <History history={history} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Magentus Coding Challenge</p>
      </footer>
    </div>
  );
}

export default App;
