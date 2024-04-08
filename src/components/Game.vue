<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <div class="flex" v-for="row in gameRow" :key="row">
      <div v-for="col in gameCol" :key="col">
        <Box :type="map[row - 1][col - 1]"></Box>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Box from "./Box.vue";
import { reactive } from "vue";
import { gameRow, gameCol, startGame } from "../game";

const map = reactive([]);

startGame(map);
</script>

<style scoped></style>