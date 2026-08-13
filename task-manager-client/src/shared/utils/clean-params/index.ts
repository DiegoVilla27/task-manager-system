/**
 * Cleans a query parameters object by removing empty properties.
 * 
 * @remarks
 * Properties considered empty and removed are `null`, `undefined`, empty string (`""`), 
 * and empty arrays (`[]`). This is commonly used before sending query params to backend 
 * endpoints to avoid trailing empty parameter keys in URLs.
 * 
 * @param params - The raw parameters object to clean.
 * @returns A new record with only non-empty entries, or `undefined` if the input is empty or all properties are removed.
 * 
 * @example
 * ```typescript
 * const rawParams = { page: 1, search: "", filter: null, tags: [] };
 * const cleaned = cleanParams(rawParams);
 * // Output: { page: 1 }
 * ```
 */
export const cleanParams = (
  params?: Record<string, unknown>
): Record<string, unknown> | undefined => {
  if (!params) return undefined;

  const cleaned = Object.entries(params).reduce((acc, [key, value]) => {
    const isEmpty =
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (!isEmpty) {
      acc[key] = value;
    }

    return acc;
  }, {} as Record<string, unknown>);

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};