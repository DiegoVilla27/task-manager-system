import { HttpParams } from '@angular/common/http';

/**
 * Converts a plain object into Angular `HttpParams` by filtering out empty, null, or undefined properties.
 *
 * @remarks
 * Keeps numeric entries (including `0`) and boolean values (including `false`).
 * Translates valid values into their string representation before appending.
 *
 * @param payload - Plain object mapping query keys and values.
 * @returns Cleaned instance of Angular HttpParams.
 *
 * @example
 * ```typescript
 * const params = buildCleanHttpParams({ search: 'Diego', page: 1, filter: null });
 * // Resulting params: search=Diego&page=1
 * ```
 */
export function cleanParams(payload: Record<string, unknown>): HttpParams {
  let params = new HttpParams();

  if (!payload) return params;

  Object.keys(payload).forEach((key) => {
    const value = payload[key];

    // Filtramos explícitamente null, undefined y strings vacíos tras hacerles .trim()
    const isNullOrUndefined = value === null || value === undefined;
    const isEmptyString = typeof value === 'string' && value.trim() === '';

    if (!isNullOrUndefined && !isEmptyString) {
      // HttpParams requiere que todos los valores se guarden como strings
      params = params.set(key, value.toString());
    }
  });

  return params;
}
