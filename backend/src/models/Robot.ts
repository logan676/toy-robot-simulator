export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export interface Position {
  x: number;
  y: number;
}

export interface RobotState {
  x: number | null;
  y: number | null;
  direction: Direction | null;
  placed: boolean;
}

const DIRECTIONS: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

const MOVE_DELTAS: Record<Direction, Position> = {
  NORTH: { x: 0, y: 1 },
  EAST: { x: 1, y: 0 },
  SOUTH: { x: 0, y: -1 },
  WEST: { x: -1, y: 0 },
};

export class Robot {
  private x: number | null = null;
  private y: number | null = null;
  private direction: Direction | null = null;

  isPlaced(): boolean {
    return this.x !== null && this.y !== null && this.direction !== null;
  }

  place(x: number, y: number, direction: Direction): boolean {
    if (!this.isValidDirection(direction)) {
      return false;
    }
    this.x = x;
    this.y = y;
    this.direction = direction;
    return true;
  }

  getNextPosition(): Position | null {
    if (!this.isPlaced() || !this.direction) {
      return null;
    }
    const delta = MOVE_DELTAS[this.direction];
    return {
      x: this.x! + delta.x,
      y: this.y! + delta.y,
    };
  }

  updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  left(): boolean {
    if (!this.isPlaced() || !this.direction) {
      return false;
    }
    const currentIndex = DIRECTIONS.indexOf(this.direction);
    this.direction = DIRECTIONS[(currentIndex + 3) % 4];
    return true;
  }

  right(): boolean {
    if (!this.isPlaced() || !this.direction) {
      return false;
    }
    const currentIndex = DIRECTIONS.indexOf(this.direction);
    this.direction = DIRECTIONS[(currentIndex + 1) % 4];
    return true;
  }

  report(): string | null {
    if (!this.isPlaced()) {
      return null;
    }
    return `${this.x},${this.y},${this.direction}`;
  }

  getState(): RobotState {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction,
      placed: this.isPlaced(),
    };
  }

  private isValidDirection(direction: string): direction is Direction {
    return DIRECTIONS.includes(direction as Direction);
  }
}
