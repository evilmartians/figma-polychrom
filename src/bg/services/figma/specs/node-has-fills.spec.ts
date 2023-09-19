import { nodeHasFills } from '~bg/services/figma/node-has-fills.ts';
import { describe, expect, test } from 'vitest';

describe('nodeHasFills', () => {
  test('should return false if node has no fills', () => {
    const node = {} as unknown as SceneNode;

    expect(nodeHasFills(node)).toBe(false);
  });

  test('should return false if node has fills but none of them are visible', () => {
    const node = {
      fills: [
        { color: { b: 0, g: 0, r: 1 }, type: 'SOLID', visible: false },
        { color: { b: 0, g: 1, r: 0 }, type: 'SOLID', visible: false },
      ],
    } as unknown as SceneNode;

    expect(nodeHasFills(node)).toBe(false);
  });

  test('should return true if node has fills and at least one of them is visible', () => {
    const node = {
      fills: [
        { color: { b: 0, g: 0, r: 1 }, type: 'SOLID', visible: false },
        { color: { b: 0, g: 1, r: 0 }, type: 'SOLID', visible: true },
      ],
    } as unknown as SceneNode;

    expect(nodeHasFills(node)).toBe(true);
  });
});
