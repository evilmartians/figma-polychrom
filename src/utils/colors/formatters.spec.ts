import { formatCss, formatHex, formatRgb, type Oklch } from 'culori/fn';
import { describe, expect, test } from 'vitest';

import { ColorSpaceDisplayModes } from '../../constants.ts';
import {
  convertDecimalRGBto255Scale,
  formatForOklchDisplay,
  formatForRgbDisplay,
  getFormatForCSSFunction,
  getFormatForDisplayFunction,
} from './formatters.ts';

describe('color formatters', () => {
  describe('convertDecimalRGBto255Scale', () => {
    test('converts decimal RGB to 255 scale', () => {
      const input = { b: 0.3, g: 0.4, r: 0.5 };
      const result = convertDecimalRGBto255Scale(input);
      expect(result).toEqual([77, 102, 128]);
    });
  });

  describe('getFormatForDisplayFunction', () => {
    test('returns correct formatter for HEX mode', () => {
      const result = getFormatForDisplayFunction(ColorSpaceDisplayModes.HEX);
      expect(result).toEqual(formatHex);
    });

    test('returns correct formatter for OKLCH mode', () => {
      const result = getFormatForDisplayFunction(ColorSpaceDisplayModes.OKLCH);
      expect(result).toEqual(formatForOklchDisplay);
    });

    test('returns correct formatter for RGB mode', () => {
      const result = getFormatForDisplayFunction(ColorSpaceDisplayModes.RGB);
      expect(result).toEqual(formatForRgbDisplay);
    });
  });

  describe('getFormatForCSSFunction', () => {
    test('returns correct formatter for HEX mode', () => {
      const result = getFormatForCSSFunction(ColorSpaceDisplayModes.HEX);
      expect(result).toEqual(formatHex);
    });

    test('returns correct formatter for OKLCH mode', () => {
      const result = getFormatForCSSFunction(ColorSpaceDisplayModes.OKLCH);
      expect(result).toEqual(formatCss);
    });

    test('returns correct formatter for RGB mode', () => {
      const result = getFormatForCSSFunction(ColorSpaceDisplayModes.RGB);
      expect(result).toEqual(formatRgb);
    });
  });

  describe('formatForOklchDisplay', () => {
    test('formats oklch values correctly', () => {
      const color: Oklch = { c: 0.4, h: 0.3, l: 0.5, mode: 'oklch' };
      expect(formatForOklchDisplay(color)).toBe('50% 0.40 0.3');
    });

    test('handles zero values in c and h', () => {
      const color: Oklch = { c: 0, h: 0, l: 0.7, mode: 'oklch' };
      expect(formatForOklchDisplay(color)).toBe('70% 0 0');
    });

    test('handles undefined h values', () => {
      const color: Oklch = { c: 0.5, l: 0.7, mode: 'oklch' };
      expect(formatForOklchDisplay(color)).toBe('70% 0.50 0.0');
    });
  });
});
