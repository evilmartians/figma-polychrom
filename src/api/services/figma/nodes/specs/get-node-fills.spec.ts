import { getNodeFills } from '~api/services/figma/nodes/get-node-fills.ts';
import { describe, expect, test } from 'vitest';

describe('getNodeFills', () => {
  test('returns fills array when node has fills that are not a symbol', () => {
    const node = {
      fills: [{ color: 'red' }, { color: 'blue' }],
    } as unknown as SceneNode;

    const result = getNodeFills(node);
    expect(result).toEqual([{ color: 'red' }, { color: 'blue' }]);
  });

  test('returns empty array when node has fills that are a symbol', () => {
    const node = {
      fills: Symbol('some-symbol'),
    } as unknown as SceneNode;

    const result = getNodeFills(node);
    expect(result).toEqual([]);
  });

  test('returns backgrounds array when node has backgrounds that are not a symbol', () => {
    const node = {
      backgrounds: [{ color: 'yellow' }, { color: 'green' }],
    } as unknown as SceneNode;

    const result = getNodeFills(node);
    expect(result).toEqual([{ color: 'yellow' }, { color: 'green' }]);
  });

  test('returns empty array when node has backgrounds that are a symbol', () => {
    const node = {
      backgrounds: Symbol('some-symbol'),
    } as unknown as SceneNode;

    const result = getNodeFills(node);
    expect(result).toEqual([]);
  });

  test('returns empty array when node doesn’t have any fills or backgrounds properties', () => {
    const node = {} as unknown as SceneNode;

    const result = getNodeFills(node);
    expect(result).toEqual([]);
  });
});
