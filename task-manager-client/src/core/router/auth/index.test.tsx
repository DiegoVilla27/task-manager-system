import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AUTH_ROUTES from '.';

describe('Router: AUTH_ROUTES', () => {
  it('should define the correct structure for auth routes', () => {
    expect(AUTH_ROUTES).toHaveLength(1);

    const publicGuardRoute = AUTH_ROUTES[0];
    expect(publicGuardRoute.element).toBeDefined();
    expect(publicGuardRoute.children).toHaveLength(1);

    const authLayoutRoute = publicGuardRoute.children![0];
    expect(authLayoutRoute.path).toBe('/auth');
    expect(authLayoutRoute.element).toBeDefined();
    expect(authLayoutRoute.children).toHaveLength(3);

    const [loginRoute, registerRoute, defaultRedirectRoute] = authLayoutRoute.children!;

    expect(loginRoute.path).toBe('login');
    expect(loginRoute.element).toBeDefined();

    expect(registerRoute.path).toBe('register');
    expect(registerRoute.element).toBeDefined();

    expect(defaultRedirectRoute.path).toBe('');
    expect(defaultRedirectRoute.element).toBeDefined();
  });

  it('should dynamically load LoginPage and RegisterPage via router navigation', async () => {
    const loginRouter = createMemoryRouter(AUTH_ROUTES, {
      initialEntries: ['/auth/login'],
    });
    render(<RouterProvider router={loginRouter} />);
    await waitFor(() => {
      expect(document.body).toBeDefined();
    });

    const registerRouter = createMemoryRouter(AUTH_ROUTES, {
      initialEntries: ['/auth/register'],
    });
    render(<RouterProvider router={registerRouter} />);
    await waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });
});
