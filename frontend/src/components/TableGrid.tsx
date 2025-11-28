import React from 'react';
import { RobotState, Direction } from '../types';
import './TableGrid.css';

interface TableGridProps {
  robotState: RobotState;
  width: number;
  height: number;
}

const directionArrows: Record<Direction, string> = {
  NORTH: '↑',
  EAST: '→',
  SOUTH: '↓',
  WEST: '←',
};

export const TableGrid: React.FC<TableGridProps> = ({ robotState, width, height }) => {
  const renderCell = (x: number, y: number) => {
    const isRobotHere = robotState.placed && robotState.x === x && robotState.y === y;

    return (
      <div
        key={`${x}-${y}`}
        className={`grid-cell ${isRobotHere ? 'has-robot' : ''}`}
      >
        {isRobotHere && robotState.direction && (
          <div className="robot">
            <span className="robot-arrow">{directionArrows[robotState.direction]}</span>
          </div>
        )}
        <span className="cell-coords">
          {x},{y}
        </span>
      </div>
    );
  };

  const rows = [];
  // Render from top (y=4) to bottom (y=0) to match coordinate system
  for (let y = height - 1; y >= 0; y--) {
    const cells = [];
    for (let x = 0; x < width; x++) {
      cells.push(renderCell(x, y));
    }
    rows.push(
      <div key={y} className="grid-row">
        {cells}
      </div>
    );
  }

  return (
    <div className="table-grid">
      <div className="grid-container">{rows}</div>
      <div className="compass">
        <span className="compass-label north">N</span>
        <span className="compass-label east">E</span>
        <span className="compass-label south">S</span>
        <span className="compass-label west">W</span>
      </div>
    </div>
  );
};
