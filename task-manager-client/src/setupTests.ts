import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import server from '@shared/mocks/sever';

// Inicia el interceptor antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Limpia automáticamente el DOM después de cada test para evitar interferencias (cleanup)
// Limpia handlers específicos que añadas en tests puntuales
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Cierra el interceptor al terminar
afterAll(() => server.close());
