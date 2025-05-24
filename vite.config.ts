import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  test:{ environment: "happy-dom" },
  plugins: [vue(), tailwindcss()],
})
