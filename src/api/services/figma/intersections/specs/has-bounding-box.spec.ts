import { hasBoundingBox } from '~api/services/figma/intersections/has-bounding-box.ts';
import { describe, expect, test } from 'vitest';

describe('hasBoundingBox', () => {
  test('should return true if node has absoluteBoundingBox and its value is not empty', () => {
    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
    } as unknown as SceneNode;

    expect(hasBoundingBox(node)).toBe(true);
  });

  test('should return false if node has absoluteBoundingBox but its value is empty', () => {
    const node = {
      absoluteBoundingBox: undefined,
    } as unknown as SceneNode;

    expect(hasBoundingBox(node)).toBe(false);
  });

  test('should return false if node does not have the property absoluteBoundingBox', () => {
    const node = {} as unknown as SceneNode;

    expect(hasBoundingBox(node)).toBe(false);
  });
});
