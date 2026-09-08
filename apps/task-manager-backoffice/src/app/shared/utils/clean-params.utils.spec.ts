import { cleanParams } from './clean-params.utils';

describe('cleanParams', () => {
  it('should return empty HttpParams if payload is null or empty', () => {
    const params = cleanParams({} as any);
    expect(params.keys().length).toBe(0);
  });

  it('should filter out null and undefined values', () => {
    const params = cleanParams({
      name: 'Diego',
      age: null,
      role: undefined,
    });

    expect(params.get('name')).toBe('Diego');
    expect(params.has('age')).toBeFalse();
    expect(params.has('role')).toBeFalse();
  });

  it('should trim string values and ignore empty strings', () => {
    const params = cleanParams({
      search: '  admin  ',
      empty: '   ',
    });

    expect(params.get('search')).toBe('admin');
    expect(params.has('empty')).toBeFalse();
  });

  it('should keep number (including 0) and boolean values', () => {
    const params = cleanParams({
      page: 0,
      limit: 10,
      active: false,
    });

    expect(params.get('page')).toBe('0');
    expect(params.get('limit')).toBe('10');
    expect(params.get('active')).toBe('false');
  });

  it('should flatten nested objects and filter out empty values', () => {
    const params = cleanParams({
      page: 1,
      limit: 10,
      filters: {
        search: 'Diego',
        status: '',
        role: undefined,
      },
    });

    expect(params.get('page')).toBe('1');
    expect(params.get('limit')).toBe('10');
    expect(params.get('search')).toBe('Diego');
    expect(params.has('status')).toBeFalse();
    expect(params.has('role')).toBeFalse();
    expect(params.has('filters')).toBeFalse();
  });
});
