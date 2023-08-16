import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        bg: resolve(__dirname, 'src', 'bg', 'index.ts'),
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
});
