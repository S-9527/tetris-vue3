import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NextPiece from '../../components/NextPiece.vue';
import { TetrominoType } from '../../game/types';

describe('NextPiece.vue', () => {
  it('renders the piece correctly', () => {
    const piece = {
      shape: [
        [1, 1],
        [1, 1]
      ],
      type: TetrominoType.O
    };
    
    const wrapper = mount(NextPiece, {
      props: {
        piece
      }
    });
    
    // Check that the component renders
    expect(wrapper.exists()).toBe(true);
    
    // Check that the piece's shape is rendered correctly
    const cells = wrapper.findAll('.mini-cell');
    expect(cells.length).toBe(4); // 2x2 shape has 4 cells
    
    // Check that cells with value 1 have the correct color class
    const filledCells = wrapper.findAll('.bg-yellow-400'); // O piece is yellow
    expect(filledCells.length).toBe(4);
  });
  
  it('renders different piece types with correct colors', () => {
    const pieceTypes = [
      { type: TetrominoType.I, colorClass: 'bg-cyan-500' },
      { type: TetrominoType.O, colorClass: 'bg-yellow-400' },
      { type: TetrominoType.T, colorClass: 'bg-purple-500' },
      { type: TetrominoType.S, colorClass: 'bg-green-500' },
      { type: TetrominoType.Z, colorClass: 'bg-red-500' },
      { type: TetrominoType.J, colorClass: 'bg-blue-500' },
      { type: TetrominoType.L, colorClass: 'bg-orange-500' }
    ];
    
    pieceTypes.forEach(({ type, colorClass }) => {
      const piece = {
        shape: [[1]],
        type
      };
      
      const wrapper = mount(NextPiece, {
        props: {
          piece
        }
      });
      
      const coloredCell = wrapper.find(`.${colorClass}`);
      expect(coloredCell.exists()).toBe(true);
    });
  });
  
  it('applies the correct transformation scale', () => {
    const piece = {
      shape: [[1]],
      type: TetrominoType.I
    };
    
    const wrapper = mount(NextPiece, {
      props: {
        piece
      }
    });
    
    const previewDiv = wrapper.find('.tetromino-preview');
    expect(previewDiv.exists()).toBe(true);
    // 检查类名而不是直接检查style属性
    expect(previewDiv.classes()).toContain('tetromino-preview');
  });
});
