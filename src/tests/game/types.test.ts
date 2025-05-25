import { describe, it, expect } from 'vitest';
import { 
  TetrominoType, 
  GameSpeed, 
  GameState, 
  Tetromino, 
  GhostPiece 
} from '../../game/types';

describe('Game Types', () => {
  describe('TetrominoType', () => {
    it('should have correct tetromino type values', () => {
      expect(TetrominoType.I).toBe(1);
      expect(TetrominoType.O).toBe(2);
      expect(TetrominoType.T).toBe(3);
      expect(TetrominoType.S).toBe(4);
      expect(TetrominoType.Z).toBe(5);
      expect(TetrominoType.J).toBe(6);
      expect(TetrominoType.L).toBe(7);
    });
  });
  
  describe('GameSpeed', () => {
    it('should have correct game speed constants', () => {
      expect(GameSpeed.DEFAULT).toBe(1000);
      expect(GameSpeed.MIN).toBe(100);
      expect(GameSpeed.SOFT_DROP).toBe(50);
      expect(GameSpeed.LEVEL_FACTOR).toBe(0.85);
    });
  });
  
  describe('Type Interfaces', () => {
    it('should create a valid Tetromino object', () => {
      const tetromino: Tetromino = {
        shape: [[1, 1], [1, 1]],
        type: TetrominoType.O,
        position: { x: 0, y: 0 }
      };
      
      expect(tetromino.shape.length).toBe(2);
      expect(tetromino.shape[0].length).toBe(2);
      expect(tetromino.type).toBe(TetrominoType.O);
      expect(tetromino.position.x).toBe(0);
      expect(tetromino.position.y).toBe(0);
    });
    
    it('should create a valid GhostPiece object', () => {
      const ghostPiece: GhostPiece = {
        shape: [[1, 1], [1, 1]],
        position: { x: 0, y: 10 }
      };
      
      expect(ghostPiece.shape.length).toBe(2);
      expect(ghostPiece.shape[0].length).toBe(2);
      expect(ghostPiece.position.x).toBe(0);
      expect(ghostPiece.position.y).toBe(10);
    });
    
    it('should create a valid GameState object', () => {
      const gameState: GameState = {
        board: [[0, 0], [0, 0]],
        activeBlock: null,
        ghostBlock: null,
        nextPieces: [],
        holdPiece: null,
        canHold: true,
        score: 0,
        level: 0,
        lines: 0,
        gameOver: false,
        isPaused: false
      };
      
      expect(gameState.board.length).toBe(2);
      expect(gameState.activeBlock).toBeNull();
      expect(gameState.ghostBlock).toBeNull();
      expect(gameState.nextPieces).toEqual([]);
      expect(gameState.holdPiece).toBeNull();
      expect(gameState.canHold).toBe(true);
      expect(gameState.score).toBe(0);
      expect(gameState.level).toBe(0);
      expect(gameState.lines).toBe(0);
      expect(gameState.gameOver).toBe(false);
      expect(gameState.isPaused).toBe(false);
    });
  });
});
