import router from '.';

describe('Router: routerConfig', () => {
  it('should create and export browser router instance with routes configured', () => {
    expect(router).toBeDefined();
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBeGreaterThanOrEqual(3);

    // Verify fallback route * is present at the end
    const lastRoute = router.routes[router.routes.length - 1];
    expect(lastRoute.path).toBe('*');
  });
});
