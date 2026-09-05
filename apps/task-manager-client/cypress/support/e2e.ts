/// <reference types="cypress" />

beforeEach(() => {
  // Limpieza de cookies o localStorage si aplica
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit('/auth/login');
});

// Ejemplo: Evitar que errores no controlados de la app fallen el test si no es lo deseado
Cypress.on('uncaught:exception', (err, runnable) => {
  // return false evita que Cypress falle el test
  return false;
});
