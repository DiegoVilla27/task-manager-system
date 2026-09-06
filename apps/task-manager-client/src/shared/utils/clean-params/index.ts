/**
 * Cleans a query parameters object by removing empty properties and flattening nested objects.
 *
 * @remarks
 * Recursively flattens nested plain objects. Trims string values and discards `null`,
 * `undefined`, or whitespace-only strings (`""`). Preserves numeric values (including `0`)
 * and booleans (including `false`), serializing all valid entries into their string representations.
 *
 * @param payload - Plain object mapping query keys and values.
 * @returns A cleaned Record with stringified values, or `undefined` if empty or invalid.
 *
 * @example
 * ```typescript
 * const raw = { search: " Diego ", page: 1, filter: null, nested: { sort: "asc" } };
 * const cleaned = cleanParams(raw);
 * // Output: { search: "Diego", page: "1", sort: "asc" }
 * ```
 */
export const cleanParams = (
  payload?: Record<string, unknown> | null,
): Record<string, string> | undefined => {
  if (!payload || typeof payload !== 'object') return undefined;

  const result: Record<string, string> = {};

  const appendEntries = (obj: Record<string, unknown>): void => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
          result[key] = trimmed;
        }
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        appendEntries(value as Record<string, unknown>);
      } else if (!Array.isArray(value)) {
        result[key] = String(value);
      }
    }
  };

  appendEntries(payload);

  return Object.keys(result).length > 0 ? result : undefined;
};
