import { createFigmaPaint } from '~test-utils/create-figma-paint.ts';
import { describe, expect, test } from 'vitest';

import { calculateApcaScore } from './calculate-apca-score.ts';

describe('calculateApcaScore SRGB', () => {
  test('should return a valid score with white foreground and black background', () => {
    const fg = createFigmaPaint({ b: 1, g: 1, r: 1 });
    const bg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    expect(calculateApcaScore(fg, bg, 'SRGB')).toBe(-108);
  });

  test('should return a valid score with black foreground and white background', () => {
    const fg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    const bg = createFigmaPaint({ b: 1, g: 1, r: 1 });
    expect(calculateApcaScore(fg, bg, 'SRGB')).toBe(106);
  });

  test('should handle edge case with zero opacity foreground', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 0);
    const bg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    expect(calculateApcaScore(fg, bg, 'SRGB')).toBe(0);
  });

  test('should handle edge case with half opacity foreground', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 0.5);
    const bg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    expect(calculateApcaScore(fg, bg, 'SRGB')).toBe(-8);
  });

  test('should handle edge case with colors near each other', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 1);
    const bg = createFigmaPaint({ b: 0.6, g: 0.6, r: 0.6 });
    expect(calculateApcaScore(fg, bg, 'SRGB')).toBe(10);
  });

  test('should handle edge case with same foreground and background colors', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 1);
    const bg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 });
    expect(calculateApcaScore(fg, bg, 'SRGB')).toBe(0);
  });
});

describe('calculateApcaScore P3', () => {
  test('should return a valid score with white foreground and black background', () => {
    const fg = createFigmaPaint({ b: 1, g: 1, r: 1 });
    const bg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    expect(calculateApcaScore(fg, bg, 'DISPLAY_P3')).toBe(-108);
  });

  test('should return a valid score with black foreground and white background', () => {
    const fg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    const bg = createFigmaPaint({ b: 1, g: 1, r: 1 });
    expect(calculateApcaScore(fg, bg, 'DISPLAY_P3')).toBe(106);
  });

  test('should handle edge case with zero opacity foreground', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 0);
    const bg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    expect(calculateApcaScore(fg, bg, 'DISPLAY_P3')).toBe(0);
  });

  test('should handle edge case with half opacity foreground', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 0.5);
    const bg = createFigmaPaint({ b: 0, g: 0, r: 0 });
    expect(calculateApcaScore(fg, bg, 'DISPLAY_P3')).toBe(-8);
  });

  test('should handle edge case with colors near each other', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 1);
    const bg = createFigmaPaint({ b: 0.6, g: 0.6, r: 0.6 });
    expect(calculateApcaScore(fg, bg, 'DISPLAY_P3')).toBe(11);
  });

  test('should handle edge case with same foreground and background colors', () => {
    const fg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 }, 1);
    const bg = createFigmaPaint({ b: 0.5, g: 0.5, r: 0.5 });
    expect(calculateApcaScore(fg, bg, 'DISPLAY_P3')).toBe(0);
  });
});
