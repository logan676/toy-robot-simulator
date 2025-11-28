import React, { useState } from 'react';
import './CommandInput.css';

interface CommandInputProps {
  onExecuteCommand: (command: string) => void;
  onExecuteBatch: (commands: string) => void;
  onReset: () => void;
  disabled: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onExecuteCommand,
  onExecuteBatch,
  onReset,
  disabled,
}) => {
  const [command, setCommand] = useState('');
  const [batchMode, setBatchMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    if (batchMode) {
      onExecuteBatch(command);
    } else {
      onExecuteCommand(command);
    }
    setCommand('');
  };

  const quickCommands = [
    { label: 'MOVE', command: 'MOVE' },
    { label: 'LEFT', command: 'LEFT' },
    { label: 'RIGHT', command: 'RIGHT' },
    { label: 'REPORT', command: 'REPORT' },
  ];

  const exampleBatch = `PLACE 0,0,NORTH
MOVE
MOVE
RIGHT
MOVE
REPORT`;

  return (
    <div className="command-input">
      <div className="mode-toggle">
        <button
          className={`mode-btn ${!batchMode ? 'active' : ''}`}
          onClick={() => setBatchMode(false)}
        >
          Single Command
        </button>
        <button
          className={`mode-btn ${batchMode ? 'active' : ''}`}
          onClick={() => setBatchMode(true)}
        >
          Batch Mode
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {batchMode ? (
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder={`Enter commands (one per line):\n${exampleBatch}`}
            disabled={disabled}
            rows={8}
            className="batch-input"
          />
        ) : (
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter command (e.g., PLACE 0,0,NORTH)"
            disabled={disabled}
            className="single-input"
          />
        )}
        <div className="button-row">
          <button type="submit" disabled={disabled || !command.trim()} className="execute-btn">
            Execute
          </button>
          <button type="button" onClick={onReset} disabled={disabled} className="reset-btn">
            Reset
          </button>
        </div>
      </form>

      {!batchMode && (
        <div className="quick-commands">
          <span className="quick-label">Quick:</span>
          {quickCommands.map((qc) => (
            <button
              key={qc.command}
              onClick={() => onExecuteCommand(qc.command)}
              disabled={disabled}
              className="quick-btn"
            >
              {qc.label}
            </button>
          ))}
        </div>
      )}

      <div className="help-text">
        <strong>Commands:</strong>
        <ul>
          <li><code>PLACE X,Y,F</code> - Place robot at (X,Y) facing F (NORTH/SOUTH/EAST/WEST)</li>
          <li><code>MOVE</code> - Move one unit forward</li>
          <li><code>LEFT</code> / <code>RIGHT</code> - Rotate 90°</li>
          <li><code>REPORT</code> - Show current position</li>
        </ul>
      </div>
    </div>
  );
};
