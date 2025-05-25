<template>
  <div class="flex items-center justify-center w-full h-full">
    <div class="tetromino-preview">
      <div v-for="(row, rowIndex) in piece.shape" :key="rowIndex" class="flex">
        <div v-for="(cell, colIndex) in row" :key="colIndex" 
             :class="[
               'mini-cell',
               cell ? getColorClass(piece.type) : 'bg-transparent'
             ]">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Piece } from '../game/types';

interface Props {
  piece: Piece;
}

defineProps<Props>()

// Map tetromino types to color classes
const getColorClass = (type: number) => {
  const colorMap: Record<number, string> = {
    1: 'bg-cyan-500',    // I piece
    2: 'bg-yellow-400',  // O piece
    3: 'bg-purple-500',  // T piece
    4: 'bg-green-500',   // S piece
    5: 'bg-red-500',     // Z piece
    6: 'bg-blue-500',    // J piece
    7: 'bg-orange-500',  // L piece
  };
  
  return colorMap[type] || 'bg-gray-600';
};
</script>

<style scoped>
.tetromino-preview {
  transform: scale(0.8);
}

.mini-cell {
  width: 15px;
  height: 15px;
  margin: 1px;
  border-radius: 2px;
}
</style>
