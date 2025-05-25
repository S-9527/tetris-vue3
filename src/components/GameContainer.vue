<template>
  <div class="flex flex-col items-center">
    <!-- Game Title -->
    <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse-slow">
      Vue Tetris
    </h1>
    
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left Side Panel -->
      <div class="flex flex-col gap-4 order-2 md:order-1">
        <!-- Hold Piece -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <h2 class="text-lg font-semibold mb-2 text-blue-300">Hold</h2>
          <div class="w-24 h-24 bg-gray-900 rounded flex items-center justify-center">
            <HoldPiece :piece="gameState.holdPiece" />
          </div>
        </div>
        
        <!-- Game Stats -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div class="mb-2">
            <h3 class="text-sm text-gray-400">Score</h3>
            <p class="text-2xl font-bold text-yellow-300">{{ gameState.score }}</p>
          </div>
          <div class="mb-2">
            <h3 class="text-sm text-gray-400">Level</h3>
            <p class="text-2xl font-bold text-green-400">{{ gameState.level }}</p>
          </div>
          <div>
            <h3 class="text-sm text-gray-400">Lines</h3>
            <p class="text-2xl font-bold text-blue-400">{{ gameState.lines }}</p>
          </div>
        </div>
      </div>
      
      <!-- Game Board -->
      <div class="relative order-1 md:order-2">
        <div class="bg-gray-800 p-1 rounded-lg border border-gray-700 shadow-lg">
          <GameBoard 
            :board="gameState.board" 
            :activeBlock="gameState.activeBlock"
            :ghostBlock="gameState.ghostBlock" 
            :gameOver="gameState.gameOver"
            :isPaused="gameState.isPaused"
          />
        </div>
        
        <!-- Overlay Messages -->
        <div v-if="gameState.gameOver || gameState.isPaused" 
             class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
          <div class="text-center p-6">
            <h2 class="text-3xl font-bold mb-4" :class="gameState.gameOver ? 'text-red-500' : 'text-yellow-400'">
              {{ gameState.gameOver ? 'Game Over' : 'Paused' }}
            </h2>
            <button @click="gameState.gameOver ? resetGame() : togglePause()" 
                    class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-200">
              {{ gameState.gameOver ? 'Play Again' : 'Resume' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Side Panel -->
      <div class="flex flex-col gap-4 order-3">
        <!-- Next Pieces -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <h2 class="text-lg font-semibold mb-2 text-blue-300">Next</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(piece, index) in gameState.nextPieces" :key="index" 
                 class="w-24 h-24 bg-gray-900 rounded flex items-center justify-center">
              <NextPiece :piece="piece" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import GameBoard from './GameBoard.vue';
import HoldPiece from './HoldPiece.vue';
import NextPiece from './NextPiece.vue';
import { useGameEngine } from '../composables/useGameEngine';

// Initialize game state and engine
const { 
  gameState, 
  resetGame, 
  moveLeft, 
  moveRight, 
  moveDown, 
  rotateBlock, 
  hardDrop, 
  holdCurrentPiece, 
  togglePause 
} = useGameEngine();

// Handle keyboard controls
const handleKeydown = (e: KeyboardEvent) => {
  if (gameState.gameOver) return;
  
  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      rotateBlock();
      break;
    case ' ':
      hardDrop();
      break;
    case 'c':
    case 'C':
      holdCurrentPiece();
      break;
    case 'p':
    case 'P':
      togglePause();
      break;
    case 'r':
    case 'R':
      if (gameState.gameOver) resetGame();
      break;
  }
};

// Handle touch controls
let touchStartX = 0;
let touchStartY = 0;
let lastTapTime = 0;

const handleTouchStart = (e: TouchEvent) => {
  if (gameState.gameOver || gameState.isPaused) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  
  // Detect double tap for pause
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTapTime;
  if (tapLength < 300 && tapLength > 0) {
    togglePause();
  }
  lastTapTime = currentTime;
};

const handleTouchEnd = (e: TouchEvent) => {
  if (gameState.gameOver || gameState.isPaused) return;
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  
  // Determine if it's a swipe
  if (Math.abs(diffX) > 50 || Math.abs(diffY) > 50) {
    // Horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } 
    // Vertical swipe
    else {
      if (diffY > 0) {
        hardDrop();
      } else {
        rotateBlock();
      }
    }
  } 
  // Simple tap (not double) for hold
  else if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
    holdCurrentPiece();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);
  resetGame();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
