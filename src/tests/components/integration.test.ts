import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import GameContainer from '../../components/GameContainer.vue';
import * as gameEngineModule from '../../composables/useGameEngine';
import { TetrominoType, GameState } from '../../game/types';

// 定义模拟控制器的类型
interface MockControls {
  resetGame: ReturnType<typeof vi.fn>;
  moveLeft: ReturnType<typeof vi.fn>;
  moveRight: ReturnType<typeof vi.fn>;
  moveDown: ReturnType<typeof vi.fn>;
  rotateBlock: ReturnType<typeof vi.fn>;
  hardDrop: ReturnType<typeof vi.fn>;
  holdCurrentPiece: ReturnType<typeof vi.fn>;
  togglePause: ReturnType<typeof vi.fn>;
}

// 创建完整的游戏状态对象模拟
const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
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
  isPaused: false,
  ...overrides
});

// 创建所有游戏控制函数的模拟
const createMockControls = (): MockControls => ({
  resetGame: vi.fn(),
  moveLeft: vi.fn(),
  moveRight: vi.fn(), 
  moveDown: vi.fn(),
  rotateBlock: vi.fn(),
  hardDrop: vi.fn(),
  holdCurrentPiece: vi.fn(),
  togglePause: vi.fn()
});

// Mock the useGameEngine composable
vi.mock('../../composables/useGameEngine', () => ({
  useGameEngine: vi.fn()
}));

// Mock Vue lifecycle hooks
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: vi.fn((callback) => callback()),
    onUnmounted: vi.fn()
  };
});

describe('Tetris Game Integration', () => {
  let mockGameState: GameState;
  let mockControls: MockControls;
  
  beforeEach(() => {
    // Mock event listeners
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});
    vi.spyOn(document, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {});
    
    // Reset mocks
    vi.clearAllMocks();
    
    // 初始化测试数据
    mockGameState = createMockGameState();
    mockControls = createMockControls();
    
    // 设置游戏引擎模拟
    const useGameEngineMock = gameEngineModule.useGameEngine as any;
    useGameEngineMock.mockReturnValue({
      gameState: mockGameState,
      ...mockControls
    });
  });
  
  it('初始游戏加载时正确显示空的游戏板和默认状态', async () => {
    const wrapper = mount(GameContainer);
    await flushPromises();
    
    // 检查分数、等级和行数初始值
    expect(wrapper.text()).toContain('Score');
    expect(wrapper.text()).toContain('0');
    expect(wrapper.text()).toContain('Level');
    expect(wrapper.text()).toContain('0');
    expect(wrapper.text()).toContain('Lines');
    expect(wrapper.text()).toContain('0');
    
    // 检查游戏板存在
    expect(wrapper.find('.game-board').exists()).toBe(true);
    
    // 检查NextPiece和HoldPiece组件已渲染
    expect(wrapper.text()).toContain('Hold');
    expect(wrapper.text()).toContain('Next');
  });
  
  it('当用户按下方向键时，应调用相应的移动函数', async () => {
    mount(GameContainer);
    
    // 获取keydown事件处理函数
    const addEventListener = window.addEventListener as unknown as { mock: { calls: any[][] } };
    const keydownCall = addEventListener.mock.calls.find(
      (call) => call[0] === 'keydown'
    );
    
    // 确保找到了keydown事件处理程序
    expect(keydownCall).toBeDefined();
    if (!keydownCall) return; // 提前返回以满足TypeScript
    
    const keydownHandler = keydownCall[1] as (event: KeyboardEvent) => void;
    
    // 模拟按键
    keydownHandler({ key: 'ArrowLeft' } as KeyboardEvent);
    expect(mockControls.moveLeft).toHaveBeenCalledTimes(1);
    
    keydownHandler({ key: 'ArrowRight' } as KeyboardEvent);
    expect(mockControls.moveRight).toHaveBeenCalledTimes(1);
    
    keydownHandler({ key: 'ArrowDown' } as KeyboardEvent);
    expect(mockControls.moveDown).toHaveBeenCalledTimes(1);
    
    keydownHandler({ key: 'ArrowUp' } as KeyboardEvent);
    expect(mockControls.rotateBlock).toHaveBeenCalledTimes(1);
    
    keydownHandler({ key: ' ' } as KeyboardEvent); // 空格键
    expect(mockControls.hardDrop).toHaveBeenCalledTimes(1);
  });
  
  it('当游戏状态为游戏结束时，应显示游戏结束界面并提供重新开始选项', async () => {
    // 设置游戏结束状态
    const gameOverState = createMockGameState({ gameOver: true });
    (gameEngineModule.useGameEngine as any).mockReturnValue({
      gameState: gameOverState,
      ...mockControls
    });
    
    const wrapper = mount(GameContainer);
    
    // 检查游戏结束界面
    expect(wrapper.text()).toContain('Game Over');
    
    // 检查重新开始按钮
    const resetButton = wrapper.find('button');
    expect(resetButton.text()).toContain('Play Again');
    
    // 点击重新开始按钮
    await resetButton.trigger('click');
    expect(mockControls.resetGame).toHaveBeenCalled();
  });
  
  it('当用户按下hold键时，应调用holdCurrentPiece函数', async () => {
    mount(GameContainer);
    
    // 获取keydown事件处理函数
    const addEventListener = window.addEventListener as unknown as { mock: { calls: any[][] } };
    const keydownCall = addEventListener.mock.calls.find(
      (call) => call[0] === 'keydown'
    );
    
    // 确保找到了keydown事件处理程序
    expect(keydownCall).toBeDefined();
    if (!keydownCall) return; // 提前返回以满足TypeScript
    
    const keydownHandler = keydownCall[1] as (event: KeyboardEvent) => void;
    
    // 模拟按C键保存方块
    keydownHandler({ key: 'c' } as KeyboardEvent);
    expect(mockControls.holdCurrentPiece).toHaveBeenCalledTimes(1);
  });
  
  it('游戏暂停后再继续时UI应正确更新', async () => {
    // 初始设置为非暂停状态
    let wrapper = mount(GameContainer);
    
    // 检查初始状态没有暂停界面
    expect(wrapper.text()).not.toContain('Paused');
    
    // 卸载原组件
    wrapper.unmount();
    
    // 设置新的暂停状态并重新挂载
    const pausedState = createMockGameState({ isPaused: true });
    (gameEngineModule.useGameEngine as any).mockReturnValue({
      gameState: pausedState,
      ...mockControls
    });
    
    // 重新挂载组件
    wrapper = mount(GameContainer);
    await flushPromises();
    
    // 检查暂停界面
    expect(wrapper.text()).toContain('Paused');
    
    // 找到并点击Resume按钮
    const resumeButton = wrapper.find('button');
    expect(resumeButton.text()).toContain('Resume');
    await resumeButton.trigger('click');
    expect(mockControls.togglePause).toHaveBeenCalled();
  });
  
  it('分数增加时UI应正确更新', async () => {
    // 初始分数为0
    let wrapper = mount(GameContainer);
    expect(wrapper.text()).toContain('Score');
    expect(wrapper.text()).toContain('0');
    
    // 卸载原组件
    wrapper.unmount();
    
    // 更新分数为1000并重新挂载
    const stateWithScore = createMockGameState({
      score: 1000
    });
    
    (gameEngineModule.useGameEngine as any).mockReturnValue({
      gameState: stateWithScore,
      ...mockControls
    });
    
    // 重新挂载组件
    wrapper = mount(GameContainer);
    await flushPromises();
    
    // 检查分数已更新
    expect(wrapper.text()).toContain('1000');
  });
  
  it('当有保存的方块时，HoldPiece组件应正确显示', async () => {
    // 设置保存的方块
    const stateWithHold = createMockGameState({
      holdPiece: {
        shape: [[1, 1, 1]],
        position: { x: 0, y: 0 },
        type: TetrominoType.T
      }
    });
    
    (gameEngineModule.useGameEngine as any).mockReturnValue({
      gameState: stateWithHold,
      ...mockControls
    });
    
    const wrapper = mount(GameContainer);
    
    // 检查Hold区域内容不为空
    expect(wrapper.text()).not.toContain('Empty');
  });
});
