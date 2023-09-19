import { isDifferentNodeWithBoundingBox } from '~bg/services/figma/is-different-node-with-bounding-box.ts';
import { describe, expect, test } from 'vitest';

describe('isDifferentNodeWithBoundingBox', () => {
  test('should return true if node has a different ID and an absoluteBoundingBox', () => {
    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '1',
    } as unknown as SceneNode;
    const selectedNodeId = '2';

    expect(isDifferentNodeWithBoundingBox(node, selectedNodeId)).toBe(true);
  });

  test('should return false if node has the same ID but has an absoluteBoundingBox', () => {
    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '1',
    } as unknown as SceneNode;
    const selectedNodeId = '1';

    expect(isDifferentNodeWithBoundingBox(node, selectedNodeId)).toBe(false);
  });

  test('should return false if node has a different ID but no absoluteBoundingBox', () => {
    const node = {
      id: '1',
    } as unknown as SceneNode;
    const selectedNodeId = '2';

    expect(isDifferentNodeWithBoundingBox(node, selectedNodeId)).toBe(false);
  });

  test('should return false if node has the same ID and no absoluteBoundingBox', () => {
    const node = {
      id: '1',
    } as unknown as SceneNode;
    const selectedNodeId = '1';

    expect(isDifferentNodeWithBoundingBox(node, selectedNodeId)).toBe(false);
  });
});
