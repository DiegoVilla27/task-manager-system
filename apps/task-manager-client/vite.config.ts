import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

const aliases = {
  '@core': path.resolve(import.meta.dirname, './src/core'),
  '@features': path.resolve(import.meta.dirname, './src/features'),
  '@shared': path.resolve(import.meta.dirname, './src/shared'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    passWithNoTests: true,
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
        'src/core/environments/**',
        'src/**/*.integration.*',
        'src/shared/mocks/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    projects: [
      {
        resolve: {
          alias: aliases,
        },
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: './src/setupTests.ts',
          include: ['**/*.{test,spec}.{ts,tsx}'],
          exclude: ['**/*.integration.*', 'node_modules', 'dist'],
        },
      },
      {
        resolve: {
          alias: aliases,
        },
        test: {
          name: 'integration',
          globals: true,
          environment: 'jsdom',
          setupFiles: './src/setupTests.ts',
          include: ['**/*.integration.{test,spec}.{ts,tsx}'],
          exclude: ['node_modules', 'dist'],
        },
      },
    ],
  },
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: aliases,
  },
});
