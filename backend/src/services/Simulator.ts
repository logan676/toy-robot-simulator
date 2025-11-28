import { Robot, RobotState } from '../models/Robot';
import { Table } from '../models/Table';
import { Command, CommandParser } from './CommandParser';

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

export class Simulator {
  private robot: Robot;
  private table: Table;
  private parser: CommandParser;
  private history: ExecutionHistory[] = [];

  constructor(tableWidth: number = 5, tableHeight: number = 5) {
    this.robot = new Robot();
    this.table = new Table(tableWidth, tableHeight);
    this.parser = new CommandParser();
  }

  executeCommand(input: string): SimulatorResult {
    const command = this.parser.parse(input);

    if (!command) {
      const result: SimulatorResult = {
        success: false,
        state: this.robot.getState(),
        message: `Invalid command: ${input}`,
      };
      this.history.push({ command: input, result });
      return result;
    }

    const result = this.execute(command);
    this.history.push({ command: input, result });
    return result;
  }

  executeMultiple(input: string): SimulatorResult[] {
    const commands = this.parser.parseMultiple(input);
    return commands.map((cmd) => {
      const result = this.execute(cmd);
      const cmdString = this.commandToString(cmd);
      this.history.push({ command: cmdString, result });
      return result;
    });
  }

  private execute(command: Command): SimulatorResult {
    switch (command.type) {
      case 'PLACE':
        return this.executePlaceCommand(command.x, command.y, command.direction);
      case 'MOVE':
        return this.executeMoveCommand();
      case 'LEFT':
        return this.executeLeftCommand();
      case 'RIGHT':
        return this.executeRightCommand();
      case 'REPORT':
        return this.executeReportCommand();
    }
  }

  private executePlaceCommand(
    x: number,
    y: number,
    direction: string
  ): SimulatorResult {
    const position = { x, y };

    if (!this.table.isValidPosition(position)) {
      return {
        success: false,
        state: this.robot.getState(),
        message: `Invalid position: (${x}, ${y}) is outside the table`,
      };
    }

    this.robot.place(x, y, direction as any);
    return {
      success: true,
      state: this.robot.getState(),
      message: `Placed robot at (${x}, ${y}) facing ${direction}`,
    };
  }

  private executeMoveCommand(): SimulatorResult {
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        state: this.robot.getState(),
        message: 'Robot has not been placed yet',
      };
    }

    const nextPosition = this.robot.getNextPosition();

    if (!nextPosition || !this.table.isValidPosition(nextPosition)) {
      return {
        success: false,
        state: this.robot.getState(),
        message: 'Move would cause robot to fall off the table',
      };
    }

    this.robot.updatePosition(nextPosition.x, nextPosition.y);
    return {
      success: true,
      state: this.robot.getState(),
      message: `Moved to (${nextPosition.x}, ${nextPosition.y})`,
    };
  }

  private executeLeftCommand(): SimulatorResult {
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        state: this.robot.getState(),
        message: 'Robot has not been placed yet',
      };
    }

    this.robot.left();
    const state = this.robot.getState();
    return {
      success: true,
      state,
      message: `Turned left, now facing ${state.direction}`,
    };
  }

  private executeRightCommand(): SimulatorResult {
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        state: this.robot.getState(),
        message: 'Robot has not been placed yet',
      };
    }

    this.robot.right();
    const state = this.robot.getState();
    return {
      success: true,
      state,
      message: `Turned right, now facing ${state.direction}`,
    };
  }

  private executeReportCommand(): SimulatorResult {
    if (!this.robot.isPlaced()) {
      return {
        success: false,
        state: this.robot.getState(),
        message: 'Robot has not been placed yet',
      };
    }

    const report = this.robot.report();
    return {
      success: true,
      output: report || undefined,
      state: this.robot.getState(),
      message: `Report: ${report}`,
    };
  }

  private commandToString(command: Command): string {
    if (command.type === 'PLACE') {
      return `PLACE ${command.x},${command.y},${command.direction}`;
    }
    return command.type;
  }

  getState(): RobotState {
    return this.robot.getState();
  }

  getHistory(): ExecutionHistory[] {
    return [...this.history];
  }

  getTableDimensions(): { width: number; height: number } {
    return this.table.getDimensions();
  }

  reset(): void {
    this.robot = new Robot();
    this.history = [];
  }
}
