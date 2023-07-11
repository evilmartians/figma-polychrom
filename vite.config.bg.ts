/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2015',
    rollupOptions: {
      input: {
        bg: resolve(__dirname, 'src', 'bg', 'index.ts'),
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
  test: {
    name: 'bg',
    exclude: ['node_modules', 'src/ui/**/*.spec.tsx'],
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(__dirname, 'coverage', 'bg'),
    },
  },
});
