import { cn } from ".";

describe('cn', () => {
  it('should merge multiple class names', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});