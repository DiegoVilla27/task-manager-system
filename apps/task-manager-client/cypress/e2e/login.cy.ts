describe('Auth: Login (E2E)', () => {
  it('should show errors if form is invalid', () => {
    cy.get('button[type="submit"]').click();
    cy.contains(/el correo electrónico es requerido/i).should('be.visible');
    cy.contains(/la contraseña es requerida/i).should('be.visible');
  });

  it('should logged successfully and redirect to home', () => {
    cy.get('input[name="email"]').type('admin@taskmanager.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').click();

    // RUTA ABSOLUTA
    // cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    // RUTA RELATIVA
    cy.location('pathname').should('eq', '/');

    cy.window().then((w) => {
      expect(w.localStorage.getItem('TOKEN')).to.exist;
      expect(w.localStorage.getItem('REFRESH')).to.exist;
      expect(w.localStorage.getItem('ME')).to.exist;
    });

    cy.contains(/gestión de tareas/i).should('be.visible');
    cy.contains(/diego villa/i).should('be.visible');
    cy.contains(/admin@taskmanager.com/i).should('be.visible');
  });
});
