<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <GameContainer />
  </div>
</template>

<script setup lang="ts">
import GameContainer from "./components/GameContainer.vue";
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}
</style>
