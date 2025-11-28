export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export interface RobotState {
  x: number | null;
  y: number | null;
  direction: Direction | null;
  placed: boolean;
}

export interface SimulatorResult {
  success: boolean;
  output?: string;
  state: RobotState;
  message?: string;
}

export interface ExecutionHistory {
  command: string;
  result: SimulatorResult;
}

export interface TableDimensions {
  width: number;
  height: number;
}

export interface ApiState {
  state: RobotState;
  table: TableDimensions;
  history: ExecutionHistory[];
}

export interface CommandResponse {
  result: SimulatorResult;
  history: ExecutionHistory[];
}
