import { Direction } from '../models/Robot';

export type CommandType = 'PLACE' | 'MOVE' | 'LEFT' | 'RIGHT' | 'REPORT';

export interface PlaceCommand {
  type: 'PLACE';
  x: number;
  y: number;
  direction: Direction;
}

export interface SimpleCommand {
  type: 'MOVE' | 'LEFT' | 'RIGHT' | 'REPORT';
}

export type Command = PlaceCommand | SimpleCommand;

const VALID_DIRECTIONS: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

export class CommandParser {
  parse(input: string): Command | null {
    const trimmed = input.trim().toUpperCase();

    if (trimmed === 'MOVE') {
      return { type: 'MOVE' };
    }

    if (trimmed === 'LEFT') {
      return { type: 'LEFT' };
    }

    if (trimmed === 'RIGHT') {
      return { type: 'RIGHT' };
    }

    if (trimmed === 'REPORT') {
      return { type: 'REPORT' };
    }

    if (trimmed.startsWith('PLACE ')) {
      return this.parsePlaceCommand(trimmed);
    }

    return null;
  }

  private parsePlaceCommand(input: string): PlaceCommand | null {
    const match = input.match(/^PLACE\s+(\d+)\s*,\s*(\d+)\s*,\s*(\w+)$/);

    if (!match) {
      return null;
    }

    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    const direction = match[3] as Direction;

    if (!VALID_DIRECTIONS.includes(direction)) {
      return null;
    }

    return {
      type: 'PLACE',
      x,
      y,
      direction,
    };
  }

  parseMultiple(input: string): Command[] {
    const lines = input.split('\n');
    const commands: Command[] = [];

    for (const line of lines) {
      const command = this.parse(line);
      if (command) {
        commands.push(command);
      }
    }

    return commands;
  }
}
