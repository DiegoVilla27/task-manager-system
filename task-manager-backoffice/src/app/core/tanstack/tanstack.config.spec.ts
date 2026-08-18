import tanstackConfig from './index';

describe('tanstackConfig', () => {
  it('should create a QueryClient instance with default options', () => {
    const client = tanstackConfig();
    expect(client).toBeTruthy();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(30000);
    expect(client.getDefaultOptions().queries?.retry).toBe(1);
  });
});
