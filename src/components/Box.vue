<template>
  <div class="size-5 m-0.5" :style="{ backgroundColor: color }">{{ type }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type: number
}

const props = defineProps<Props>()

const typeToColorMap: Record<number, string> = {
  [0]: 'gray',
  [1]: 'red',
}

const color = computed(() => typeToColorMap[props.type])
</script>

<style scoped></style>