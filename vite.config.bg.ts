import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        bg: resolve(__dirname, 'bg.ts'),
      },
      output: {
        entryFileNames: `[name].js`,
      }
    },
  },
})
