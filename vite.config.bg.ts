/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~bg': resolve(__dirname, 'src', 'bg'),
      '~test-utils': resolve(__dirname, 'src', 'test-utils'),
      '~types': resolve(__dirname, 'src', 'types'),
      '~utils': resolve(__dirname, 'src', 'utils'),
    },
  },
  build: {
    minify: false,
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
