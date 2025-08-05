import { formatHex, type Oklch } from 'culori/fn';
import { describe, expect, test } from 'vitest';

import { ColorSpaceDisplayModes } from '../../constants.ts';
import {
  convertDecimalRGBto255Scale,
  formatForHexCSS,
  formatForOklchCSS,
  formatForOklchDisplay,
  formatForRGBCSS,
  formatForRgbDisplay,
  getFormatterForCSS,
  getFormatterForDisplaying,
} from './formatters.ts';

describe('color formatters', () => {
  describe('convertDecimalRGBto255Scale', () => {
    test('converts decimal RGB to 255 scale', () => {
      const input = { b: 0.3, g: 0.4, r: 0.5 };
      const result = convertDecimalRGBto255Scale(input);
      expect(result).toEqual({
        b: 77,
        g: 102,
        r: 128,
      });
    });
  });

  describe('getFormatForDisplayFunction', () => {
    test('returns correct formatter for HEX mode', () => {
      const result = getFormatterForDisplaying(ColorSpaceDisplayModes.HEX);
      expect(result).toEqual(formatHex);
    });

    test('returns correct formatter for OKLCH mode', () => {
      const result = getFormatterForDisplaying(ColorSpaceDisplayModes.OKLCH);
      expect(result).toEqual(formatForOklchDisplay);
    });

    test('returns correct formatter for RGB mode', () => {
      const result = getFormatterForDisplaying(ColorSpaceDisplayModes.RGB);
      expect(result).toEqual(formatForRgbDisplay);
    });
  });

  describe('getFormatForCSSFunction', () => {
    test('returns correct formatter for HEX mode', () => {
      const result = getFormatterForCSS(ColorSpaceDisplayModes.HEX);
      expect(result).toEqual(formatForHexCSS);
    });

    test('returns correct formatter for OKLCH mode', () => {
      const result = getFormatterForCSS(ColorSpaceDisplayModes.OKLCH);
      expect(result).toEqual(formatForOklchCSS);
    });

    test('returns correct formatter for RGB mode', () => {
      const result = getFormatterForCSS(ColorSpaceDisplayModes.RGB);
      expect(result).toEqual(formatForRGBCSS);
    });
  });

  describe('formatForOklchDisplay', () => {
    test('formats oklch values correctly', () => {
      const color: Oklch = { c: 0.4, h: 0.3, l: 0.5, mode: 'oklch' };
      expect(formatForOklchDisplay(color)).toBe('50% 0.4 0.3');
    });

    test('handles zero values in c and h', () => {
      const color: Oklch = { c: 0, h: 0, l: 0.7, mode: 'oklch' };
      expect(formatForOklchDisplay(color)).toBe('70% 0 0');
    });

    test('handles undefined h values', () => {
      const color: Oklch = { c: 0.5, l: 0.7, mode: 'oklch' };
      expect(formatForOklchDisplay(color)).toBe('70% 0.5 0');
    });
  });
});
