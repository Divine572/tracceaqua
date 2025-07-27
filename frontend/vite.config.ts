import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Remove incorrect tailwindcss import


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  },
)
