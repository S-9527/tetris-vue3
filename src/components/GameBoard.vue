<template>
  <div class="game-board">
    <div v-for="(row, rowIndex) in combinedBoard" :key="rowIndex" class="flex">
      <div v-for="(cell, colIndex) in row" :key="colIndex" 
           class="cell transition-all duration-100"
           :class="[getCellColorClass(cell), {
             'border border-gray-700': cell === 0,
             'shadow-glow': cell > 0 && cell !== 8, 
             'ghost-piece': cell === 8
           }]">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Position } from '../game/types';

interface GhostBlock {
  shape: number[][];
  position: Position;
}

interface ActiveBlock {
  shape: number[][];
  position: Position;
  type: number;
}

interface Props {
  board: number[][];
  activeBlock?: ActiveBlock;
  ghostBlock?: GhostBlock;
  gameOver: boolean;
  isPaused: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isPaused: false,
  gameOver: false
});

// Combine the static board with active tetromino and ghost piece
const combinedBoard = computed(() => {
  // Create a deep copy of the board to avoid mutating the original
  const result = props.board.map(row => [...row]);
  
  // Add ghost piece (if available)
  if (props.ghostBlock && !props.gameOver && !props.isPaused) {
    const { shape, position } = props.ghostBlock;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardRow = position.y + row;
          const boardCol = position.x + col;
          if (boardRow >= 0 && boardRow < result.length && 
              boardCol >= 0 && boardCol < result[0].length) {
            // Only draw ghost if the cell is empty
            if (result[boardRow][boardCol] === 0) {
              result[boardRow][boardCol] = 8; // 8 is our ghost piece type
            }
          }
        }
      }
    }
  }
  
  // Add active tetromino (if available)
  if (props.activeBlock && !props.gameOver) {
    const { shape, position, type } = props.activeBlock;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardRow = position.y + row;
          const boardCol = position.x + col;
          if (boardRow >= 0 && boardRow < result.length && 
              boardCol >= 0 && boardCol < result[0].length) {
            result[boardRow][boardCol] = type;
          }
        }
      }
    }
  }
  
  return result;
});

// Map cell values to color classes
const getCellColorClass = (value: number) => {
  const colorMap: Record<number, string> = {
    0: 'bg-gray-900',
    1: 'bg-cyan-500',    // I piece
    2: 'bg-yellow-400',  // O piece
    3: 'bg-purple-500',  // T piece
    4: 'bg-green-500',   // S piece
    5: 'bg-red-500',     // Z piece
    6: 'bg-blue-500',    // J piece
    7: 'bg-orange-500',  // L piece
    8: 'bg-gray-700 opacity-40' // Ghost piece
  };
  
  return colorMap[value] || 'bg-gray-900';
};
</script>

<style scoped>
.game-board {
  width: 300px;
  height: 600px;
}

.cell {
  width: 30px;
  height: 30px;
  box-sizing: border-box;
}

.shadow-glow {
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5);
}

.ghost-piece {
  border: 1px dashed rgba(255, 255, 255, 0.3) !important;
}
</style>
