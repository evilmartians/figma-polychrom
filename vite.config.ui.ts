/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: './src/ui',
  build: {
    emptyOutDir: false,
    outDir: resolve(__dirname, 'dist'),
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
