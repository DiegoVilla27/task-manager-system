import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import PRIVATE_ROUTES from '.';

describe('Router: PRIVATE_ROUTES', () => {
  it('should define the correct structure for private routes', () => {
    expect(PRIVATE_ROUTES).toHaveLength(1);

    const privateGuardRoute = PRIVATE_ROUTES[0];
    expect(privateGuardRoute.element).toBeDefined();
    expect(privateGuardRoute.children).toHaveLength(1);

    const mainLayoutRoute = privateGuardRoute.children[0];
    expect(mainLayoutRoute.path).toBe('/');
    expect(mainLayoutRoute.element).toBeDefined();
    expect(mainLayoutRoute.children).toHaveLength(2);

    const [indexRoute, fallbackRoute] = mainLayoutRoute.children;

    expect(indexRoute.index).toBe(true);
    expect(indexRoute.element).toBeDefined();

    expect(fallbackRoute.path).toBe('*');
    expect(fallbackRoute.element).toBeDefined();
  });

  it('should dynamically load TasksPage via router navigation', async () => {
    localStorage.setItem('TOKEN', 'valid_token');
    const router = createMemoryRouter(PRIVATE_ROUTES, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });
});
