import { Robot } from './Robot';

describe('Robot', () => {
  let robot: Robot;

  beforeEach(() => {
    robot = new Robot();
  });

  describe('initial state', () => {
    it('should not be placed initially', () => {
      expect(robot.isPlaced()).toBe(false);
    });

    it('should return null for report when not placed', () => {
      expect(robot.report()).toBeNull();
    });
  });

  describe('place', () => {
    it('should place robot at valid position', () => {
      expect(robot.place(0, 0, 'NORTH')).toBe(true);
      expect(robot.isPlaced()).toBe(true);
    });

    it('should correctly set position and direction', () => {
      robot.place(2, 3, 'EAST');
      const state = robot.getState();
      expect(state.x).toBe(2);
      expect(state.y).toBe(3);
      expect(state.direction).toBe('EAST');
    });

    it('should reject invalid direction', () => {
      expect(robot.place(0, 0, 'INVALID' as any)).toBe(false);
      expect(robot.isPlaced()).toBe(false);
    });
  });

  describe('getNextPosition', () => {
    it('should return null when not placed', () => {
      expect(robot.getNextPosition()).toBeNull();
    });

    it('should calculate next position for NORTH', () => {
      robot.place(2, 2, 'NORTH');
      expect(robot.getNextPosition()).toEqual({ x: 2, y: 3 });
    });

    it('should calculate next position for EAST', () => {
      robot.place(2, 2, 'EAST');
      expect(robot.getNextPosition()).toEqual({ x: 3, y: 2 });
    });

    it('should calculate next position for SOUTH', () => {
      robot.place(2, 2, 'SOUTH');
      expect(robot.getNextPosition()).toEqual({ x: 2, y: 1 });
    });

    it('should calculate next position for WEST', () => {
      robot.place(2, 2, 'WEST');
      expect(robot.getNextPosition()).toEqual({ x: 1, y: 2 });
    });
  });

  describe('left', () => {
    it('should return false when not placed', () => {
      expect(robot.left()).toBe(false);
    });

    it('should rotate from NORTH to WEST', () => {
      robot.place(0, 0, 'NORTH');
      robot.left();
      expect(robot.getState().direction).toBe('WEST');
    });

    it('should rotate from WEST to SOUTH', () => {
      robot.place(0, 0, 'WEST');
      robot.left();
      expect(robot.getState().direction).toBe('SOUTH');
    });

    it('should rotate from SOUTH to EAST', () => {
      robot.place(0, 0, 'SOUTH');
      robot.left();
      expect(robot.getState().direction).toBe('EAST');
    });

    it('should rotate from EAST to NORTH', () => {
      robot.place(0, 0, 'EAST');
      robot.left();
      expect(robot.getState().direction).toBe('NORTH');
    });
  });

  describe('right', () => {
    it('should return false when not placed', () => {
      expect(robot.right()).toBe(false);
    });

    it('should rotate from NORTH to EAST', () => {
      robot.place(0, 0, 'NORTH');
      robot.right();
      expect(robot.getState().direction).toBe('EAST');
    });

    it('should rotate from EAST to SOUTH', () => {
      robot.place(0, 0, 'EAST');
      robot.right();
      expect(robot.getState().direction).toBe('SOUTH');
    });

    it('should rotate from SOUTH to WEST', () => {
      robot.place(0, 0, 'SOUTH');
      robot.right();
      expect(robot.getState().direction).toBe('WEST');
    });

    it('should rotate from WEST to NORTH', () => {
      robot.place(0, 0, 'WEST');
      robot.right();
      expect(robot.getState().direction).toBe('NORTH');
    });
  });

  describe('report', () => {
    it('should return correct format', () => {
      robot.place(1, 2, 'EAST');
      expect(robot.report()).toBe('1,2,EAST');
    });
  });
});
