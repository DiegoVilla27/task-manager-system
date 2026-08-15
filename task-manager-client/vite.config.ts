import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // Permite usar describe, it, expect sin importarlos en cada archivo
    environment: 'jsdom', // Simula el DOM de un navegador
    setupFiles: './src/setupTests.ts', // Archivo de configuración global opcional pero recomendado
    coverage: {
      provider: 'v8', // Motor de cobertura
      reporter: ['text', 'json', 'html', 'lcov'], // Formatos de reporte
      include: ['src/**/*.{ts,tsx}'], // Qué archivos medir
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/setupTests.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/interfaces/**',
        'src/**/types/**',
        'src/**/models/**',
        'src/**/schema/**',
        'src/**/layout/**',
        'src/**/layouts/**',
        'src/**/pages/**',
        'src/core/environments/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      '@core': path.resolve(import.meta.dirname, './src/core'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
    },
  },
});
