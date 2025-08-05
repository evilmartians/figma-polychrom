import { isContainedIn } from '~api/services/figma/intersections/is-contained-in.ts';
import { describe, expect, test } from 'vitest';

describe('isContainedIn', () => {
  test('should return true for identical rectangles', () => {
    const outer = { height: 50, width: 50, x: 10, y: 10 };
    const inner = { height: 50, width: 50, x: 10, y: 10 };

    expect(isContainedIn(outer, inner)).toBe(true);
  });

  test('should return true for fully contained rectangles', () => {
    const outer = { height: 100, width: 100, x: 0, y: 0 };
    const inner = { height: 50, width: 50, x: 25, y: 25 };

    expect(isContainedIn(outer, inner)).toBe(true);
  });

  test('should return false for partially overlapping rectangles', () => {
    const outer = { height: 100, width: 100, x: 0, y: 0 };
    const inner = { height: 60, width: 60, x: 50, y: 50 };

    expect(isContainedIn(outer, inner)).toBe(false);
  });

  test('should return false for completely external rectangles', () => {
    const outer = { height: 100, width: 100, x: 0, y: 0 };
    const inner = { height: 10, width: 10, x: 110, y: 110 };

    expect(isContainedIn(outer, inner)).toBe(false);
  });

  test('should handle negative coordinates', () => {
    const outer = { height: 100, width: 100, x: -50, y: -50 };
    const inner = { height: 50, width: 50, x: -25, y: -25 };

    expect(isContainedIn(outer, inner)).toBe(true);
  });

  test('should handle zero dimensions', () => {
    const outer = { height: 100, width: 100, x: 0, y: 0 };
    const inner = { height: 0, width: 0, x: 0, y: 0 };

    expect(isContainedIn(outer, inner)).toBe(true);
  });
});
