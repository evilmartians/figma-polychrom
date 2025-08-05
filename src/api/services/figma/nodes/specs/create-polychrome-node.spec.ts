import { describe, expect, test } from 'vitest';

import { createPolychromNode } from '../create-polychrom-node.ts';

describe('createPolychromNode', () => {
  test('should handle nodes with no fills', () => {
    const node = {
      fills: [],
      id: '123',
      name: 'some-name',
      opacity: 1,
      visible: true,
    } as unknown as SceneNode;

    const result = createPolychromNode(node);

    expect(result).toEqual({
      blendMode: 'PASS_THROUGH',
      children: [],
      fills: [],
      id: '123',
      isSelected: false,
      name: 'some-name',
      nestingLevel: 0,
      opacity: 1,
      parents: [],
      visible: true,
      zIndex: undefined,
    });
  });

  test('should handle multiple solid fills', () => {
    const node = {
      fills: [
        { color: { b: 1, g: 1, r: 1 }, type: 'SOLID' },
        { color: { b: 0.5, g: 0.5, r: 0.5 }, type: 'SOLID' },
      ],
      id: '123',
    } as unknown as SceneNode;

    const result = createPolychromNode(node);

    expect(result.fills).toHaveLength(2);
  });

  test('should handle undefined fills gracefully', () => {
    const node = {
      id: '123',
    } as unknown as SceneNode;

    const result = createPolychromNode(node);

    expect(result.fills).toEqual([]);
  });

  test('should handle Symbol fills gracefully', () => {
    const node = {
      fills: Symbol('some-symbol'),
      id: '123',
    } as unknown as SceneNode;

    const result = createPolychromNode(node);

    expect(result.fills).toEqual([]);
  });

  test('should handle nodes without an id', () => {
    const node = {
      fills: [{ color: { b: 0, g: 0, r: 0 }, type: 'SOLID' }],
    } as unknown as SceneNode;

    const result = createPolychromNode(node);

    expect(result.id).toBeUndefined();
    expect(result.fills).toHaveLength(1);
  });
});
