import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpia automáticamente el DOM después de cada test para evitar interferencias
afterEach(() => {
  cleanup();
});