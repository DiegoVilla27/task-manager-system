import { describe, expect, it } from 'vitest';
import { cleanParams } from '.';

describe('cleanParams', () => {
  it('should return undefined when input is undefined, null, or not an object', () => {
    expect(cleanParams()).toBeUndefined();
    expect(cleanParams(undefined)).toBeUndefined();
    expect(cleanParams(null)).toBeUndefined();
  });

  it('should return undefined when input object is empty', () => {
    expect(cleanParams({})).toBeUndefined();
  });

  it('should return undefined when all entries are empty, null, or undefined', () => {
    const raw = {
      name: null,
      age: undefined,
      description: '',
      notes: '   ',
      tags: [],
    };

    expect(cleanParams(raw)).toBeUndefined();
  });

  it('should trim string values and ignore whitespace-only strings', () => {
    const raw = {
      search: '  John Doe  ',
      role: 'admin',
      emptySpaces: '     ',
    };

    expect(cleanParams(raw)).toEqual({
      search: 'John Doe',
      role: 'admin',
    });
  });

  it('should keep and stringify valid falsy primitives like 0 and false', () => {
    const raw = {
      page: 0,
      limit: 10,
      isActive: false,
      isVerified: true,
    };

    expect(cleanParams(raw)).toEqual({
      page: '0',
      limit: '10',
      isActive: 'false',
      isVerified: 'true',
    });
  });

  it('should ignore array values as per the function constraints', () => {
    const raw = {
      page: 1,
      tags: ['angular', 'react'],
      emptyArray: [],
    };

    expect(cleanParams(raw)).toEqual({
      page: '1',
    });
  });

  it('should recursively flatten nested plain objects', () => {
    const raw = {
      search: 'Diego',
      nested: {
        sort: 'asc',
        filter: {
          archived: false,
          deletedAt: null,
          blank: '   ',
        },
      },
    };

    expect(cleanParams(raw)).toEqual({
      search: 'Diego',
      sort: 'asc',
      archived: 'false',
    });
  });

  it('should return undefined if a nested object only contains invalid properties', () => {
    const raw = {
      filter: {
        status: null,
        empty: '   ',
        tags: [],
      },
    };

    expect(cleanParams(raw)).toBeUndefined();
  });
});
