import { cleanParams } from ".";

describe('cleanParams', () => {
  it('should return undefined if params is undefined', () => {
    const params = undefined;
    expect(cleanParams(params)).toBeUndefined();
  });

  it('should remove empty properties', () => {
    const params = {
      page: 1,
      search: '',
      filter: null,
      tags: [],
    };
    expect(cleanParams(params)).toEqual({ page: 1 });
  });

  it('should return undefined if all properties are empty', () => {
    const params = {
      name: ''
    };
    expect(cleanParams(params)).toBeUndefined();
  });
});