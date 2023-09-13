import { describe, expect, test } from 'vitest';

import { getSiblingsBefore } from './get-siblings-before.ts';

describe('getSiblingsBefore', () => {
  test('returns all nodes before the target node', () => {
    const nodeA = { id: 'A' } as unknown as SceneNode;
    const nodeB = { id: 'B' } as unknown as SceneNode;
    const nodeC = { id: 'C' } as unknown as SceneNode;
    const allNodes = [nodeA, nodeB, nodeC];

    const result = getSiblingsBefore(nodeC, allNodes);

    expect(result).toEqual([nodeA, nodeB]);
  });

  test('returns an empty array if the target node is not found', () => {
    const nodeA = { id: 'A' } as unknown as SceneNode;
    const nodeB = { id: 'B' } as unknown as SceneNode;
    const nodeC = { id: 'C' } as unknown as SceneNode;
    const allNodes = [nodeA, nodeB];

    const result = getSiblingsBefore(nodeC, allNodes);

    expect(result).toEqual([]);
  });

  test('returns all nodes when the target is the last node', () => {
    const nodeA = { id: 'A' } as unknown as SceneNode;
    const nodeB = { id: 'B' } as unknown as SceneNode;
    const nodeC = { id: 'C' } as unknown as SceneNode;
    const allNodes = [nodeA, nodeB, nodeC];

    const result = getSiblingsBefore(nodeA, allNodes);

    expect(result).toEqual([]);
  });
});
