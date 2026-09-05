describe('Auth: Register (E2E)', () => {
  beforeEach(() => {
    cy.get('a')
      .contains(/regístrate aquí/i)
      .click();

    cy.location('pathname').should('eq', '/auth/register');
    cy.contains(/crear una cuenta/i).should('be.visible');
  });

  it('should show errors if form is invalid', () => {
    cy.get('button[type="submit"]').click();

    cy.contains(/name must be at least 3 characters long/i).should('be.visible');
    cy.contains(/last name must be at least 3 characters long/i).should('be.visible');
    cy.contains(/invalid email format/i).should('be.visible');
    cy.contains(/password must be at least 8 characters long/i).should('be.visible');
    cy.contains(/confirm password must be at least 8 characters long/i).should('be.visible');
  });

  it('should register successfully', () => {
    const timestamp = Date.now();
    const user = {
      name: 'Andres',
      lastname: 'Perez',
      email: `andresp_${timestamp}@gmail.com`,
    };

    cy.get('input[name="name"]').type(user.name);
    cy.get('input[name="lastname"]').type(user.lastname);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type('12345678');
    cy.get('input[name="confirmPassword"]').type('12345678');

    cy.get('button[type="submit"]').click();

    cy.location('pathname').should('eq', '/');

    cy.window().then((w) => {
      expect(w.localStorage.getItem('TOKEN')).to.exist;
      expect(w.localStorage.getItem('REFRESH')).to.exist;
      expect(w.localStorage.getItem('ME')).to.exist;
    });

    cy.contains(/gestión de tareas/i).should('be.visible');
    cy.contains(`${user.name} ${user.lastname}`).should('be.visible');
    cy.contains(user.email).should('be.visible');
  });
});
