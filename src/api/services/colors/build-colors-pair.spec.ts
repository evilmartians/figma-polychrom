import { createFigmaPaint } from '~utils/figma/create-figma-paint.ts';
import { describe, expect, test, vi } from 'vitest';

import { buildColorsPair } from './build-colors-pair.ts';

vi.stubGlobal('figma', {
  root: {
    documentProfile: 'йцвйцвй',
  },
});

describe('buildColorsPair', () => {
  test('should return a valid color pair with given fg and bg', () => {
    const fg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    const bg = createFigmaPaint({ b: 1, g: 1, r: 1 });
    const result = buildColorsPair('sample-id', fg, bg);

    expect(result).toEqual({
      apca: 106,
      bg,
      fg,
      id: 'sample-id',
    });
  });
});
