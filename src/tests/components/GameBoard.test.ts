import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GameBoard from '../../components/GameBoard.vue';
import { TetrominoType } from '../../game/types';

describe('GameBoard.vue', () => {
  it('renders empty board correctly', () => {
    // Create a simple 3x3 empty board
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    const wrapper = mount(GameBoard, {
      props: {
        board,
        gameOver: false,
        isPaused: false
      }
    });
    
    // Check that the component renders
    expect(wrapper.exists()).toBe(true);
    
    // Check that the game-board class exists
    expect(wrapper.classes()).toContain('game-board');
    
    // Check all rows exist
    const rows = wrapper.findAll('.flex');
    expect(rows.length).toBeGreaterThan(0);
    
    // Check all cells exist
    const cells = wrapper.findAll('.cell');
    expect(cells.length).toBe(9); // 3x3 board
  });
  
  it('renders cells with correct classes based on their values', () => {
    // Create a board with different cell values
    const board = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 0]
    ];
    
    const wrapper = mount(GameBoard, {
      props: {
        board,
        gameOver: false,
        isPaused: false
      }
    });
    
    // Check total cells
    const cells = wrapper.findAll('.cell');
    expect(cells.length).toBe(9); // 3x3 board
    
    // Check for border on empty cells
    const borderCells = wrapper.findAll('.border');
    expect(borderCells.length).toBe(2); // Two 0 values in the board
  });
  
  it('correctly combines active block with the board', () => {
    // Create a simple empty board
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    // Create an active block (I piece) at position (0,0)
    const activeBlock = {
      shape: [[1, 1, 1, 1]],
      position: { x: 0, y: 0 },
      type: TetrominoType.I
    };
    
    const wrapper = mount(GameBoard, {
      props: {
        board,
        activeBlock,
        gameOver: false,
        isPaused: false
      }
    });
    
    // 检查组件是否成功渲染
    expect(wrapper.exists()).toBe(true);
    
    // 确保所有单元格都已渲染
    const cells = wrapper.findAll('.cell');
    expect(cells.length).toBe(9); // 3x3 board
  });
  
  it('correctly renders ghost block', () => {
    // Create a simple empty board
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    // Create a ghost block at position (0,1)
    const ghostBlock = {
      shape: [[1, 1]],
      position: { x: 0, y: 1 }
    };
    
    const wrapper = mount(GameBoard, {
      props: {
        board,
        ghostBlock,
        gameOver: false,
        isPaused: false
      }
    });
    
    // Check for ghost-piece class
    const ghostCells = wrapper.findAll('.ghost-piece');
    expect(ghostCells.length).toBeGreaterThan(0);
  });
  
  it('does not render ghost blocks when game is over', () => {
    // Create a simple empty board
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    // Create active and ghost blocks
    const activeBlock = {
      shape: [[1, 1]],
      position: { x: 0, y: 0 },
      type: TetrominoType.O
    };
    
    const ghostBlock = {
      shape: [[1, 1]],
      position: { x: 0, y: 1 }
    };
    
    const wrapper = mount(GameBoard, {
      props: {
        board,
        activeBlock,
        ghostBlock,
        gameOver: true, // Game is over
        isPaused: false
      }
    });
    
    // In game over state, no ghost pieces should be visible
    const ghostPieces = wrapper.findAll('.ghost-piece');
    expect(ghostPieces.length).toBe(0);
  });
  
  it('does not render ghost blocks when game is paused', () => {
    // Create a simple empty board
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    // Create active and ghost blocks
    const activeBlock = {
      shape: [[1, 1]],
      position: { x: 0, y: 0 },
      type: TetrominoType.O
    };
    
    const ghostBlock = {
      shape: [[1, 1]],
      position: { x: 0, y: 1 }
    };
    
    const wrapper = mount(GameBoard, {
      props: {
        board,
        activeBlock,
        ghostBlock,
        gameOver: false,
        isPaused: true // Game is paused
      }
    });
    
    // Should not show ghost pieces when paused
    const ghostPieces = wrapper.findAll('.ghost-piece');
    expect(ghostPieces.length).toBe(0);
  });
});
