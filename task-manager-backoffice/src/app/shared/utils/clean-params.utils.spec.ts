import { cleanParams } from './clean-params.utils';

describe('cleanParams', () => {
  it('should return empty HttpParams if payload is empty, null or undefined', () => {
    expect(cleanParams({}).toString()).toBe('');
    expect(
      cleanParams(null as unknown as Record<string, unknown>).toString(),
    ).toBe('');
  });

  it('should filter out null, undefined, and empty/whitespace strings', () => {
    const params = cleanParams({
      search: 'Diego',
      role: '',
      status: '   ',
      emptyVal: null,
      undefVal: undefined,
      page: 1,
      zero: 0,
      active: false,
    });

    expect(params.get('search')).toBe('Diego');
    expect(params.get('page')).toBe('1');
    expect(params.get('zero')).toBe('0');
    expect(params.get('active')).toBe('false');
    expect(params.has('role')).toBeFalse();
    expect(params.has('status')).toBeFalse();
    expect(params.has('emptyVal')).toBeFalse();
    expect(params.has('undefVal')).toBeFalse();
  });
});
