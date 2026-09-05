/**
 * @fileoverview Unit tests for the `cleanParams` query parameter sanitization utility.
 * Verifies that empty strings, null values, and empty arrays are stripped before making API requests.
 *
 * @module shared/utils/clean-params.test
 */

import { cleanParams } from '.';

describe('cleanParams', () => {
  /**
   * Verifies that passing `undefined` as the input object returns `undefined` safely
   * without throwing any runtime TypeError exceptions.
   */
  it('should return undefined if params is undefined', () => {
    const params = undefined;
    expect(cleanParams(params)).toBeUndefined();
  });

  /**
   * Verifies that empty strings, `null` values, and empty arrays are pruned from the query object,
   * while preserving valid truthy or numeric values like page numbers.
   */
  it('should remove empty properties', () => {
    const params = {
      page: 1,
      search: '',
      filter: null,
      tags: [],
    };
    expect(cleanParams(params)).toEqual({ page: 1 });
  });

  /**
   * Verifies that if all object properties contain empty or invalid values,
   * the function returns `undefined` rather than an empty object `{}`.
   */
  it('should return undefined if all properties are empty', () => {
    const params = {
      name: '',
    };
    expect(cleanParams(params)).toBeUndefined();
  });
});
