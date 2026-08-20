import tanstackConfig from './index';

describe('tanstackConfig', () => {
  it('should create a QueryClient with configured staleTime and retry', () => {
    const client = tanstackConfig();
    expect(client).toBeTruthy();
    const defaultOptions = client.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(30_000);
    expect(defaultOptions.queries?.retry).toBe(1);
  });
});
