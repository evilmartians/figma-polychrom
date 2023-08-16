import { describe, expect, test } from 'vitest';

import { createFigmaNode } from './create-figma-node';

describe('createFigmaNode', () => {
  test('should handle nodes with no fills', () => {
    const node = { fills: [], id: '123' } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result).toEqual({
      fills: [],
      id: '123',
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
    expect(result.fills[0].type).toBe('SOLID');
  });

  test('should convert solid fill colors to hex and oklch format', () => {
    const node = {
      fills: [{ color: { b: 0, g: 0, r: 0 }, type: 'SOLID' }],
      id: '123',
    } as unknown as SceneNode;

    const result = createFigmaNode(node);

    expect(result.fills[0].hex).toBe('#000000');
    expect(result.fills[0].oklch).toEqual({
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
