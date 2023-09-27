import { describe, expect, test } from 'vitest';

import { traverseAndCheckIntersections } from '../traverse-and-check-intersections';

describe('traverseAndCheckIntersections', () => {
  test('should return an empty array if no nodes are intersecting with the selected node', () => {
    const nodes = [
      {
        absoluteBoundingBox: { height: 50, width: 50, x: 200, y: 200 },
        id: '1',
      },
    ] as unknown as SceneNode[];

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 10, y: 10 },
      id: '2',
    } as unknown as SceneNode;

    expect(traverseAndCheckIntersections(nodes, selectedNode)).toEqual([]);
  });

  test('should return nodes that are intersecting with the selected node', () => {
    const nodes = [
      {
        absoluteBoundingBox: { height: 100, width: 100, x: 0, y: 0 },
        id: '1',
      },
    ] as unknown as SceneNode[];

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 10, y: 10 },
      id: '2',
    } as unknown as SceneNode;

    expect(traverseAndCheckIntersections(nodes, selectedNode)).toEqual(nodes);
  });

  test('should return nodes and their children that are intersecting with the selected node', () => {
    const frameNode = {
      absoluteBoundingBox: { height: 100, width: 100, x: 0, y: 0 },
      children: [
        {
          absoluteBoundingBox: { height: 90, width: 90, x: 0, y: 0 },
          id: '3',
        },
      ],
      id: '1',
    } as unknown as FrameNode;

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 10, y: 10 },
      id: '2',
    } as unknown as SceneNode;

    expect(traverseAndCheckIntersections([frameNode], selectedNode)).toEqual([
      frameNode,
      frameNode.children[0],
    ]);
  });

  test('should return nodes intersecting, but not their children if they don’t intersect', () => {
    const nodes = [
      {
        absoluteBoundingBox: { height: 100, width: 100, x: 0, y: 0 },
        children: [
          {
            absoluteBoundingBox: { height: 5, width: 5, x: 90, y: 90 },
            id: '3',
          },
        ],
        id: '1',
      },
    ] as unknown as SceneNode[];

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 10, y: 10 },
      id: '2',
    } as unknown as SceneNode;

    expect(traverseAndCheckIntersections(nodes, selectedNode)).toEqual([
      nodes[0],
    ]);
  });

  test('should not consider nodes that are identical to the selected node as intersecting', () => {
    const nodes = [
      {
        absoluteBoundingBox: { height: 50, width: 50, x: 10, y: 10 },
        id: '2',
      },
    ] as unknown as SceneNode[];

    const selectedNode = {
      absoluteBoundingBox: { height: 50, width: 50, x: 10, y: 10 },
      id: '2',
    } as unknown as SceneNode;

    expect(traverseAndCheckIntersections(nodes, selectedNode)).toEqual([]);
  });
});
