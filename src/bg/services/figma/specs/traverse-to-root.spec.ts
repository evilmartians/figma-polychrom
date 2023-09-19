import { traverseToRoot } from '~bg/services/figma/traverse-to-root.ts';
import { describe, expect, test } from 'vitest';

describe('traverseToRoot', () => {
  test('should return an array with only the node if it has no parent', () => {
    const node = {
      id: '1',
      parent: null,
    } as unknown as SceneNode;

    expect(traverseToRoot(node)).toEqual([node]);
  });

  test('should return an array with the node and its parent if it has one parent', () => {
    const parent = {
      id: '1',
      parent: null,
    } as unknown as SceneNode;

    const node: SceneNode = {
      id: '2',
      parent,
    } as unknown as SceneNode;

    expect(traverseToRoot(node)).toEqual([parent, node]);
  });

  test('should return an array with the node and all its parents if it has multiple parents', () => {
    const grandparent = {
      id: '1',
      parent: null,
    } as unknown as SceneNode;

    const parent = {
      id: '2',
      parent: grandparent,
    } as unknown as SceneNode;

    const node = {
      id: '3',
      parent,
    } as unknown as SceneNode;

    expect(traverseToRoot(node)).toEqual([grandparent, parent, node]);
  });
});
