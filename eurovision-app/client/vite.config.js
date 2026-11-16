import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // <-- добавьте это

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})