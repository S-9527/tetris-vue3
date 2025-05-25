import { describe, it, expect, vi } from 'vitest';
import { 
  GAME_CONFIG, 
  TETROMINO_TEMPLATES, 
  calculateSpeed, 
  getRandomTetromino 
} from '../../game/config';
import { GameSpeed, TetrominoType } from '../../game/types';

describe('Game Configuration', () => {
  describe('GAME_CONFIG', () => {
    it('should have correct board dimensions', () => {
      expect(GAME_CONFIG.boardWidth).toBe(10);
      expect(GAME_CONFIG.boardHeight).toBe(20);
    });
    
    it('should have correct next pieces count', () => {
      expect(GAME_CONFIG.nextPiecesCount).toBe(3);
    });
    
    it('should have correct points per line values', () => {
      expect(GAME_CONFIG.pointsPerLine).toEqual([100, 300, 500, 800]);
    });
    
    it('should have correct lines per level value', () => {
      expect(GAME_CONFIG.linesPerLevel).toBe(10);
    });
  });
  
  describe('TETROMINO_TEMPLATES', () => {
    it('should have 7 tetromino types', () => {
      expect(TETROMINO_TEMPLATES.length).toBe(7);
    });
    
    it('should have correct tetromino types', () => {
      const types = TETROMINO_TEMPLATES.map(template => template.type);
      expect(types).toContain(TetrominoType.I);
      expect(types).toContain(TetrominoType.O);
      expect(types).toContain(TetrominoType.T);
      expect(types).toContain(TetrominoType.S);
      expect(types).toContain(TetrominoType.Z);
      expect(types).toContain(TetrominoType.J);
      expect(types).toContain(TetrominoType.L);
    });
    
    it('should have correct rotations for I piece', () => {
      const iPiece = TETROMINO_TEMPLATES.find(t => t.type === TetrominoType.I);
      expect(iPiece).toBeDefined();
      expect(iPiece?.rotations.length).toBe(4);
    });
    
    it('should have only one rotation for O piece', () => {
      const oPiece = TETROMINO_TEMPLATES.find(t => t.type === TetrominoType.O);
      expect(oPiece).toBeDefined();
      expect(oPiece?.rotations.length).toBe(1);
    });
    
    it('should have correct rotations for other pieces', () => {
      const nonIOPieces = TETROMINO_TEMPLATES.filter(
        t => t.type !== TetrominoType.I && t.type !== TetrominoType.O
      );
      
      nonIOPieces.forEach(piece => {
        expect(piece.rotations.length).toBe(4);
      });
    });
  });
  
  describe('calculateSpeed', () => {
    it('should return default speed for level 0', () => {
      expect(calculateSpeed(0)).toBe(GameSpeed.DEFAULT);
    });
    
    it('should decrease speed (increase value) as level increases', () => {
      const level1Speed = calculateSpeed(1);
      const level2Speed = calculateSpeed(2);
      
      expect(level1Speed).toBeLessThan(GameSpeed.DEFAULT);
      expect(level2Speed).toBeLessThan(level1Speed);
    });
    
    it('should not go below minimum speed', () => {
      // Testing a very high level to ensure it doesn't go below minimum
      const highLevelSpeed = calculateSpeed(100);
      expect(highLevelSpeed).toBe(GameSpeed.MIN);
    });
  });
  
  describe('getRandomTetromino', () => {
    it('should return a valid tetromino template', () => {
      // Mock Math.random to return predictable values
      const randomSpy = vi.spyOn(Math, 'random');
      
      // Test for first tetromino
      randomSpy.mockReturnValue(0);
      let tetromino = getRandomTetromino();
      expect(tetromino).toBe(TETROMINO_TEMPLATES[0]);
      
      // Test for last tetromino
      randomSpy.mockReturnValue(0.99);
      tetromino = getRandomTetromino();
      expect(tetromino).toBe(TETROMINO_TEMPLATES[TETROMINO_TEMPLATES.length - 1]);
      
      // Restore original Math.random
      randomSpy.mockRestore();
    });
  });
});
