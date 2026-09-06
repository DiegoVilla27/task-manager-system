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
export function cleanParams<T extends object>(payload: T): HttpParams {
  let params = new HttpParams();

  if (!payload) return params;

  const appendEntries = (obj: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
          params = params.set(key, trimmed);
        }
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        appendEntries(value as Record<string, unknown>);
      } else {
        params = params.set(key, String(value));
      }
    }
  };

  appendEntries(payload as Record<string, unknown>);
  return params;
}
