import { describe, expect, test } from 'vitest';

import { createFigmaPaint } from '../figma/create-figma-paint.ts';
import { generateUIColors } from './generate-ui-colors.ts';

describe('generateUIColors', () => {
  test('should use generateForLightOnDark when fg lightness is greater than bg', () => {
    const result = generateUIColors(
      createFigmaPaint({ b: 1, g: 0.83, r: 0.83 }),
      createFigmaPaint({ b: 0.37, g: 0.5, r: 0.55 })
    );

    expect(result).toEqual({
      textPrimaryHex: '#d9d9ff',
      textSecondaryAlpha10: '#ebddb91a',
      textSecondaryAlpha60: '#ebddb999',
      textSecondaryHex: '#ebddb9',
      widgetBackgroundHex: '#1f1400',
    });
  });

  test('should use generateForDarkOnLight when fg lightness is less than or equal to bg', () => {
    const result = generateUIColors(
      createFigmaPaint({ b: 0.37, g: 0.5, r: 0.55 }),
      createFigmaPaint({ b: 1, g: 0.83, r: 0.83 })
    );

    expect(result).toEqual({
      textPrimaryHex: '#1f1400',
      textSecondaryAlpha10: '#14102f1a',
      textSecondaryAlpha60: '#14102f99',
      textSecondaryHex: '#14102f',
      widgetBackgroundHex: '#d9d9ff',
    });
  });

  test('should adjust bg lightness to 0.9 in generateForDarkOnLight', () => {
    const result = generateUIColors(
      createFigmaPaint({ b: 0.37, g: 0.5, r: 0.55 }),
      createFigmaPaint({ b: 0.57, g: 0.97, r: 0.75 })
    );
    expect(result).toEqual({
      textPrimaryHex: '#1f1400',
      textSecondaryAlpha10: '#001f001a',
      textSecondaryAlpha60: '#001f0099',
      textSecondaryHex: '#001f00',
      widgetBackgroundHex: '#bff791',
    });
  });

  test('should keep fg lightness with original value in generateForDarkOnLight', () => {
    const result = generateUIColors(
      createFigmaPaint({ b: 0.02, g: 0.05, r: 0.08 }),
      createFigmaPaint({ b: 0.3, g: 0.2, r: 0.1 })
    );

    expect(result).toEqual({
      textPrimaryHex: '#140d05',
      textSecondaryAlpha10: '#00172e1a',
      textSecondaryAlpha60: '#00172e99',
      textSecondaryHex: '#00172e',
      widgetBackgroundHex: '#c3e2ff',
    });
  });

  test('should keep bg lightness with original value in generateForLightOnDark', () => {
    const result = generateUIColors(
      createFigmaPaint({ b: 0.6, g: 0.6, r: 0.6 }),
      createFigmaPaint({ b: 0.02, g: 0.05, r: 0.08 })
    );

    expect(result).toEqual({
      textPrimaryHex: '#dedede',
      textSecondaryAlpha10: '#e8dcd01a',
      textSecondaryAlpha60: '#e8dcd099',
      textSecondaryHex: '#e8dcd0',
      widgetBackgroundHex: '#140d05',
    });
  });

  test('should keep fg lightness with original value in generateForLightOnDark', () => {
    const result = generateUIColors(
      createFigmaPaint({ b: 1, g: 1, r: 1 }),
      createFigmaPaint({ b: 0.02, g: 0.05, r: 0.08 })
    );

    expect(result).toEqual({
      textPrimaryHex: '#ffffff',
      textSecondaryAlpha10: '#e8dcd01a',
      textSecondaryAlpha60: '#e8dcd099',
      textSecondaryHex: '#e8dcd0',
      widgetBackgroundHex: '#140d05',
    });
  });
});
