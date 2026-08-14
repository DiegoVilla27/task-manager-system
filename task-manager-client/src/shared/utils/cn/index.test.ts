/**
 * @fileoverview Unit tests for the `cn` (classNames) utility.
 * Validates Tailwind CSS class merging, conflict resolution, and conditional class concatenation.
 *
 * @module shared/utils/cn.test
 */

import { cn } from ".";

describe('cn', () => {
  /**
   * Tests that conflicting Tailwind CSS classes are resolved correctly by keeping
   * the last applied class rule according to tailwind-merge precedence rules.
   *
   * @remarks
   * Evaluates standard conflict resolution between conflicting color utilities (`text-red-500` vs `text-blue-500`).
   */
  it('should merge multiple class names', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});