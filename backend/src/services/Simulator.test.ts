import { Simulator } from './Simulator';

describe('Simulator', () => {
  let simulator: Simulator;

  beforeEach(() => {
    simulator = new Simulator();
  });

  describe('Example A from spec', () => {
    it('should output 0,1,NORTH', () => {
      simulator.executeCommand('PLACE 0,0,NORTH');
      simulator.executeCommand('MOVE');
      const result = simulator.executeCommand('REPORT');

      expect(result.output).toBe('0,1,NORTH');
    });
  });

  describe('Example B from spec', () => {
    it('should output 0,0,WEST', () => {
      simulator.executeCommand('PLACE 0,0,NORTH');
      simulator.executeCommand('LEFT');
      const result = simulator.executeCommand('REPORT');

      expect(result.output).toBe('0,0,WEST');
    });
  });

  describe('Example C from spec', () => {
    it('should output 3,3,NORTH', () => {
      simulator.executeCommand('PLACE 1,2,EAST');
      simulator.executeCommand('MOVE');
      simulator.executeCommand('MOVE');
      simulator.executeCommand('LEFT');
      simulator.executeCommand('MOVE');
      const result = simulator.executeCommand('REPORT');

      expect(result.output).toBe('3,3,NORTH');
    });
  });

  describe('boundary checks', () => {
    it('should prevent robot from falling off NORTH edge', () => {
      simulator.executeCommand('PLACE 0,4,NORTH');
      const result = simulator.executeCommand('MOVE');

      expect(result.success).toBe(false);
      expect(simulator.getState().y).toBe(4);
    });

    it('should prevent robot from falling off EAST edge', () => {
      simulator.executeCommand('PLACE 4,0,EAST');
      const result = simulator.executeCommand('MOVE');

      expect(result.success).toBe(false);
      expect(simulator.getState().x).toBe(4);
    });

    it('should prevent robot from falling off SOUTH edge', () => {
      simulator.executeCommand('PLACE 0,0,SOUTH');
      const result = simulator.executeCommand('MOVE');

      expect(result.success).toBe(false);
      expect(simulator.getState().y).toBe(0);
    });

    it('should prevent robot from falling off WEST edge', () => {
      simulator.executeCommand('PLACE 0,0,WEST');
      const result = simulator.executeCommand('MOVE');

      expect(result.success).toBe(false);
      expect(simulator.getState().x).toBe(0);
    });
  });

  describe('commands before PLACE', () => {
    it('should ignore MOVE before PLACE', () => {
      const result = simulator.executeCommand('MOVE');

      expect(result.success).toBe(false);
      expect(simulator.getState().placed).toBe(false);
    });

    it('should ignore LEFT before PLACE', () => {
      const result = simulator.executeCommand('LEFT');

      expect(result.success).toBe(false);
      expect(simulator.getState().placed).toBe(false);
    });

    it('should ignore RIGHT before PLACE', () => {
      const result = simulator.executeCommand('RIGHT');

      expect(result.success).toBe(false);
      expect(simulator.getState().placed).toBe(false);
    });

    it('should ignore REPORT before PLACE', () => {
      const result = simulator.executeCommand('REPORT');

      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });
  });

  describe('invalid PLACE commands', () => {
    it('should reject PLACE outside table (negative x)', () => {
      const result = simulator.executeCommand('PLACE -1,0,NORTH');

      expect(result.success).toBe(false);
    });

    it('should reject PLACE outside table (x >= 5)', () => {
      const result = simulator.executeCommand('PLACE 5,0,NORTH');

      expect(result.success).toBe(false);
    });

    it('should reject PLACE outside table (negative y)', () => {
      const result = simulator.executeCommand('PLACE 0,-1,NORTH');

      expect(result.success).toBe(false);
    });

    it('should reject PLACE outside table (y >= 5)', () => {
      const result = simulator.executeCommand('PLACE 0,5,NORTH');

      expect(result.success).toBe(false);
    });
  });

  describe('multiple PLACE commands', () => {
    it('should allow repositioning with new PLACE', () => {
      simulator.executeCommand('PLACE 0,0,NORTH');
      simulator.executeCommand('PLACE 2,3,SOUTH');
      const result = simulator.executeCommand('REPORT');

      expect(result.output).toBe('2,3,SOUTH');
    });
  });

  describe('batch execution', () => {
    it('should execute multiple commands', () => {
      const results = simulator.executeMultiple(`PLACE 0,0,NORTH
MOVE
MOVE
RIGHT
MOVE
REPORT`);

      expect(results.length).toBe(6);
      expect(results[5].output).toBe('1,2,EAST');
    });
  });

  describe('reset', () => {
    it('should reset robot state', () => {
      simulator.executeCommand('PLACE 2,2,NORTH');
      simulator.reset();

      expect(simulator.getState().placed).toBe(false);
      expect(simulator.getHistory().length).toBe(0);
    });
  });

  describe('invalid commands', () => {
    it('should handle invalid command gracefully', () => {
      const result = simulator.executeCommand('INVALID');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid command');
    });

    it('should handle malformed PLACE command', () => {
      const result = simulator.executeCommand('PLACE abc');

      expect(result.success).toBe(false);
    });
  });
});
