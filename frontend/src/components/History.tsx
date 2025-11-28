import React from 'react';
import { ExecutionHistory } from '../types';
import './History.css';

interface HistoryProps {
  history: ExecutionHistory[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="history">
        <h3>Command History</h3>
        <p className="no-history">No commands executed yet</p>
      </div>
    );
  }

  return (
    <div className="history">
      <h3>Command History</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <div
            key={index}
            className={`history-item ${item.result.success ? 'success' : 'error'}`}
          >
            <div className="history-command">
              <span className="command-index">#{index + 1}</span>
              <code>{item.command}</code>
            </div>
            <div className="history-result">
              {item.result.output ? (
                <span className="output">Output: {item.result.output}</span>
              ) : (
                <span className="message">{item.result.message}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
