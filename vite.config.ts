// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // <-- Importe o plugin

export default defineConfig({
  plugins: [
    // ... outros plugins
    tailwindcss(), // <-- Adicione o plugin aqui
  ],
})