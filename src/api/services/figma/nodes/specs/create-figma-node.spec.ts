import { describe, expect, test } from 'vitest';

import { createFigmaNode } from '../create-figma-node.ts';

describe('createFigmaNode', () => {
  test('should handle nodes with no fills', () => {
    const node = {
      fills: [],
      id: '123',
      name: 'some-name',
      opacity: 1,
      visible: true,
    } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result).toEqual({
      fills: [],
      id: '123',
      name: 'some-name',
      nestingLevel: 0,
      opacity: 1,
      parents: [],
      visible: true,
      zIndex: undefined,
    });
  });

  test('should filter out non-solid fills', () => {
    const node = {
      fills: [
        { gradient: 'some-gradient', type: 'GRADIENT' },
        { color: { b: 0, g: 0, r: 0 }, type: 'SOLID' },
      ],
      id: '123',
    } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result.fills).toHaveLength(1);

    const [fill] = result.fills;

    expect(fill?.type).toBe('SOLID');
  });

  test('should convert solid fill colors to hex and oklch format', () => {
    const node = {
      fills: [{ color: { b: 0, g: 0, r: 0 }, type: 'SOLID' }],
      id: '123',
    } as unknown as SceneNode;

    const result = createFigmaNode(node);
    const [fill] = result.fills;

    expect(fill?.hex).toBe('#000000');
    expect(fill?.oklch).toEqual({
      c: 0,
      l: 0,
      mode: 'oklch',
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

    const result = createFigmaNode(node);

    expect(result.fills).toHaveLength(2);
  });

  test('should handle undefined fills gracefully', () => {
    const node = {
      id: '123',
    } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result.fills).toEqual([]);
  });

  test('should handle Symbol fills gracefully', () => {
    const node = {
      fills: Symbol('some-symbol'),
      id: '123',
    } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result.fills).toEqual([]);
  });

  test('should handle nodes without an id', () => {
    const node = {
      fills: [{ color: { b: 0, g: 0, r: 0 }, type: 'SOLID' }],
    } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result.id).toBeUndefined();
    expect(result.fills).toHaveLength(1);
  });
});
