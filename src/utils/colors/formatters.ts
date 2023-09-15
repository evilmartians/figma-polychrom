import { formatHex, formatRgb, modeRgb, type Oklch, useMode } from 'culori/fn';

import { type ColorSpaceDisplayModes } from '../../constants.ts';

const convertToRgb = useMode(modeRgb);

export const convertDecimalRGBto255Scale = (color: {
  b: number;
  g: number;
  r: number;
}): number[] => Object.values(color).map((value) => Math.round(value * 255));

export const formatForOklchDisplay = (oklch: Oklch): string => {
  const lValue = Math.round(oklch.l * 100);
  const cValue = oklch.c === 0 ? 0 : oklch.c.toFixed(2);
  const hValue = oklch.h === 0 ? 0 : (oklch.h ?? 0).toFixed(1);

  return `${lValue}% ${cValue} ${hValue}`;
};

export const formatForRgbDisplay = (oklch: Oklch): string => {
  const { b, g, r } = convertToRgb(oklch);
  return convertDecimalRGBto255Scale({ b, g, r }).join(' ');
};

export const getFormatterForDisplaying = (
  colorSpaceDisplayMode: ColorSpaceDisplayModes
): ((oklch: Oklch) => string) => {
  const formatters = {
    HEX: formatHex,
    OKLCH: formatForOklchDisplay,
    RGB: formatForRgbDisplay,
  };

  return formatters[colorSpaceDisplayMode];
};

export const clean = (value: number, precision = 2): number =>
  Math.round(parseFloat((value * 10 ** precision).toFixed(precision))) /
  10 ** precision;

export const toPercent = (value: number): string => `${clean(100 * value)}%`;

export const formatForOklchCSS = (color: Oklch): string => {
  const { alpha, c, h, l } = color;
  let postfix = '';
  if (typeof alpha !== 'undefined' && alpha < 1) {
    postfix = ` / ${toPercent(alpha)}`;
  }
  return `oklch(${toPercent(l)} ${clean(c)} ${clean(h ?? 0)}${postfix})`;
};

export const getFormatterForCSS = (
  colorSpaceDisplayMode: ColorSpaceDisplayModes
): ((oklch: Oklch) => string) => {
  const formatters = {
    HEX: formatHex,
    OKLCH: formatForOklchCSS,
    RGB: formatRgb,
  };

  return formatters[colorSpaceDisplayMode];
};
