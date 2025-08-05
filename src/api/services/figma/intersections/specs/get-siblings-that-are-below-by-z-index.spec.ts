import { describe, expect, test } from 'vitest';

import { getSiblingsThatAreBelowByZIndex } from '../get-siblings-that-are-below-by-z-index.ts';

describe('getSiblingsThatAreBelowByZIndex', () => {
  test('should return an empty array if targetNode is not in the list', () => {
    const allNodes = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ] as unknown as SceneNode[];

    const targetNode = { id: '4' } as unknown as SceneNode;

    expect(getSiblingsThatAreBelowByZIndex(targetNode, allNodes)).toEqual([]);
  });

  test('should return all nodes up to and including the targetNode by zIndex', () => {
    const allNodes = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ] as unknown as SceneNode[];

    const targetNode = allNodes[1] as unknown as SceneNode;

    expect(getSiblingsThatAreBelowByZIndex(targetNode, allNodes)).toEqual([
      { id: '1' },
      { id: '2' },
    ]);
  });

  test('should return only the targetNode if it is the first in the list', () => {
    const allNodes = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ] as unknown as SceneNode[];

    const targetNode = allNodes[0] as unknown as SceneNode;

    expect(getSiblingsThatAreBelowByZIndex(targetNode, allNodes)).toEqual([
      { id: '1' },
    ]);
  });

  test('should return all nodes if targetNode is the last in the list', () => {
    const allNodes = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ] as unknown as SceneNode[];

    const targetNode = allNodes[2] as unknown as SceneNode;

    expect(getSiblingsThatAreBelowByZIndex(targetNode, allNodes)).toEqual(
      allNodes
    );
  });

  test('should handle an empty list of nodes', () => {
    const allNodes = [] as unknown as SceneNode[];

    const targetNode = { id: '1' } as unknown as SceneNode;

    expect(getSiblingsThatAreBelowByZIndex(targetNode, allNodes)).toEqual([]);
  });

  test('should handle duplicate nodes correctly', () => {
    const allNodes = [
      { id: '1' },
      { id: '2' },
      { id: '2' }, // Duplicate
      { id: '3' },
    ] as unknown as SceneNode[];

    const targetNode = allNodes[1] as unknown as SceneNode;

    expect(getSiblingsThatAreBelowByZIndex(targetNode, allNodes)).toEqual([
      { id: '1' },
      { id: '2' },
    ]);
  });
});
