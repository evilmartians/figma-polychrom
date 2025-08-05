import { describe, expect, test } from 'vitest';

import { areNodesIntersecting } from '../are-nodes-intersecting.ts';

describe('areNodesIntersecting', () => {
  test('should return false if selectedNode has no bounding box', () => {
    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const selectedNode = {
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(false);
  });

  test('should return true if node and selectedNode are identical', () => {
    const node = {
      absoluteBoundingBox: { height: 50, width: 50, x: 20, y: 20 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 20, y: 20 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(true);
  });

  test('should return false if node has no bounding box', () => {
    const node = {
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 20, y: 20 },
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(false);
  });

  test('should return true if node is fully contained within selectedNode', () => {
    const selectedNode = {
      absoluteBoundingBox: { height: 40, width: 40, x: 25, y: 25 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(true);
  });

  test('should return false if node partially overlaps with selectedNode', () => {
    const node = {
      absoluteBoundingBox: { height: 60, width: 60, x: 50, y: 50 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const selectedNode = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(false);
  });

  test('should return false if node is entirely outside of selectedNode', () => {
    const node = {
      absoluteBoundingBox: { height: 10, width: 10, x: 120, y: 120 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const selectedNode = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(false);
  });

  test('should return false if node is not visible', () => {
    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '1',
      visible: false,
    } as unknown as SceneNode;

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 20, y: 20 },
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(false);
  });

  test('should return true if node is fully contained within visible selectedNode', () => {
    const selectedNode = {
      absoluteBoundingBox: { height: 40, width: 40, x: 25, y: 25 },
      id: '1',
      visible: true,
    } as unknown as SceneNode;

    const node = {
      absoluteBoundingBox: { height: 100, width: 100, x: 10, y: 10 },
      id: '2',
      visible: true,
    } as unknown as SceneNode;

    expect(areNodesIntersecting(node, selectedNode)).toBe(true);
  });
});
