import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GameContainer from '../../components/GameContainer.vue';
import { TetrominoType } from '../../game/types';
import * as gameEngineModule from '../../composables/useGameEngine';

// Mock the gameState object for testing
const mockGameState = {
  board: Array(20).fill(0).map(() => Array(10).fill(0)),
  activeBlock: {
    shape: [[1, 1], [1, 1]],
    position: { x: 4, y: 0 },
    type: TetrominoType.O
  },
  ghostBlock: {
    shape: [[1, 1], [1, 1]],
    position: { x: 4, y: 18 }
  },
  nextPieces: [
    {
      shape: [[1, 1, 1, 1]],
      position: { x: 0, y: 0 },
      type: TetrominoType.I
    }
  ],
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 0,
  lines: 0,
  gameOver: false,
  isPaused: false
};

// Mock gameState for different scenarios
const gameOverState = { ...mockGameState, gameOver: true };
const pausedState = { ...mockGameState, isPaused: true };

// 创建游戏控制函数的模拟
const mockResetGame = vi.fn();
const mockMoveLeft = vi.fn();
const mockMoveRight = vi.fn();
const mockMoveDown = vi.fn();
const mockRotateBlock = vi.fn();
const mockHardDrop = vi.fn();
const mockHoldCurrentPiece = vi.fn();
const mockTogglePause = vi.fn();

// Mock the useGameEngine composable
vi.mock('../../composables/useGameEngine', () => ({
  useGameEngine: vi.fn(() => ({
    gameState: mockGameState,
    resetGame: mockResetGame,
    moveLeft: mockMoveLeft,
    moveRight: mockMoveRight,
    moveDown: mockMoveDown,
    rotateBlock: mockRotateBlock,
    hardDrop: mockHardDrop,
    holdCurrentPiece: mockHoldCurrentPiece,
    togglePause: mockTogglePause
  }))
}));

// Mock document event listeners
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: vi.fn((callback) => callback()),
    onUnmounted: vi.fn()
  };
});

describe('GameContainer.vue', () => {
  beforeEach(() => {
    // Mock global event listeners
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});
    vi.spyOn(document, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {});
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // 重置游戏引擎模拟
    const useGameEngineMock = gameEngineModule.useGameEngine as any;
    useGameEngineMock.mockReturnValue({
      gameState: mockGameState,
      resetGame: mockResetGame,
      moveLeft: mockMoveLeft,
      moveRight: mockMoveRight,
      moveDown: mockMoveDown,
      rotateBlock: mockRotateBlock,
      hardDrop: mockHardDrop,
      holdCurrentPiece: mockHoldCurrentPiece,
      togglePause: mockTogglePause
    });
  });
  
  it('renders the game title', () => {
    const wrapper = mount(GameContainer);
    
    expect(wrapper.text()).toContain('Vue Tetris');
  });
  
  it('renders all game components', () => {
    const wrapper = mount(GameContainer);
    
    // Check for main sections
    expect(wrapper.find('h1').exists()).toBe(true);
    
    // Check for game stats sections
    expect(wrapper.text()).toContain('Score');
    expect(wrapper.text()).toContain('Level');
    expect(wrapper.text()).toContain('Lines');
  });
  
  it('displays game stats correctly', () => {
    const wrapper = mount(GameContainer);
    
    expect(wrapper.text()).toContain('Score');
    expect(wrapper.text()).toContain('Level');
    expect(wrapper.text()).toContain('Lines');
    
    // Check initial values
    expect(wrapper.text()).toContain('0'); // Score, level, and lines are all 0
  });
  
  it('shows game over overlay when game is over', () => {
    // Setup game over state
    const useGameEngineMock = gameEngineModule.useGameEngine as any;
    useGameEngineMock.mockReturnValue({
      gameState: gameOverState,
      resetGame: mockResetGame,
      moveLeft: mockMoveLeft,
      moveRight: mockMoveRight,
      moveDown: mockMoveDown,
      rotateBlock: mockRotateBlock,
      hardDrop: mockHardDrop,
      holdCurrentPiece: mockHoldCurrentPiece,
      togglePause: mockTogglePause
    });
    
    const wrapper = mount(GameContainer);
    
    // Check for game over overlay
    expect(wrapper.text()).toContain('Game Over');
    expect(wrapper.text()).toContain('Play Again');
  });
  
  it('shows pause overlay when game is paused', () => {
    // Setup paused state
    const useGameEngineMock = gameEngineModule.useGameEngine as any;
    useGameEngineMock.mockReturnValue({
      gameState: pausedState,
      resetGame: mockResetGame,
      moveLeft: mockMoveLeft,
      moveRight: mockMoveRight,
      moveDown: mockMoveDown,
      rotateBlock: mockRotateBlock,
      hardDrop: mockHardDrop,
      holdCurrentPiece: mockHoldCurrentPiece,
      togglePause: mockTogglePause
    });
    
    const wrapper = mount(GameContainer);
    
    // Check for pause overlay
    expect(wrapper.text()).toContain('Paused');
    expect(wrapper.text()).toContain('Resume');
  });
  
  it('sets up keyboard event listeners on mount', () => {
    mount(GameContainer);
    
    // Verify keyboard event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
  
  it('sets up touch event listeners on mount', () => {
    mount(GameContainer);
    
    // Verify touch event listeners were added
    expect(document.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(document.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
  });
  
  it('handles button clicks for pause toggle and game reset', async () => {
    // For pause toggle test
    const useGameEngineMock = gameEngineModule.useGameEngine as any;
    useGameEngineMock.mockReturnValue({
      gameState: pausedState,
      resetGame: mockResetGame,
      moveLeft: mockMoveLeft,
      moveRight: mockMoveRight,
      moveDown: mockMoveDown,
      rotateBlock: mockRotateBlock,
      hardDrop: mockHardDrop,
      holdCurrentPiece: mockHoldCurrentPiece,
      togglePause: mockTogglePause
    });
    
    const pausedWrapper = mount(GameContainer);
    const pauseButton = pausedWrapper.find('button');
    await pauseButton.trigger('click');
    expect(mockTogglePause).toHaveBeenCalled();
    
    // For game over test
    useGameEngineMock.mockReturnValue({
      gameState: gameOverState,
      resetGame: mockResetGame,
      moveLeft: mockMoveLeft,
      moveRight: mockMoveRight,
      moveDown: mockMoveDown,
      rotateBlock: mockRotateBlock,
      hardDrop: mockHardDrop,
      holdCurrentPiece: mockHoldCurrentPiece,
      togglePause: mockTogglePause
    });
    
    const gameOverWrapper = mount(GameContainer);
    const resetButton = gameOverWrapper.find('button');
    await resetButton.trigger('click');
    expect(mockResetGame).toHaveBeenCalled();
  });
});
