import { Position } from './Robot';

export class Table {
  constructor(
    private readonly width: number = 5,
    private readonly height: number = 5
  ) {}

  isValidPosition(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  getDimensions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }
}
