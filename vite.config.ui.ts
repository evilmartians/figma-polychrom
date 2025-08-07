/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';
import preact from '@preact/preset-vite';

export default defineConfig({
  resolve: {
    alias: {
      '~ui': resolve(__dirname, 'src', 'ui'),
      '~test-utils': resolve(__dirname, 'src', 'test-utils'),
      '~types': resolve(__dirname, 'src', 'types'),
      '~utils': resolve(__dirname, 'src', 'utils'),
    },
  },
  plugins: [preact(), viteSingleFile()],
  root: './src/ui',
  build: {
    emptyOutDir: false,
    outDir: resolve(__dirname, 'dist'),
    target: 'es2015',
  },
  test: {
    name: 'ui',
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(__dirname, 'coverage', 'ui'),
    },
  },
});
