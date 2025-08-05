/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~api': resolve(__dirname, 'src', 'api'),
      '~test-utils': resolve(__dirname, 'src', 'test-utils'),
      '~types': resolve(__dirname, 'src', 'types'),
      '~utils': resolve(__dirname, 'src', 'utils'),
    },
  },
  build: {
    minify: true,
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2015',
    rollupOptions: {
      input: {
        api: resolve(__dirname, 'src', 'api', 'index.ts'),
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
  test: {
    name: 'api',
    exclude: ['node_modules', 'src/ui/**/*.spec.tsx'],
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(__dirname, 'coverage', 'api'),
    },
  },
});
