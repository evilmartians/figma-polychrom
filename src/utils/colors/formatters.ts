import { formatHex, formatRgb, modeRgb, type Oklch, useMode } from 'culori/fn';

import { type ColorSpaceDisplayModes } from '../../constants.ts';

const convertToRgb = useMode(modeRgb);

export const convertDecimalRGBto255Scale = (color: {
  b: number;
  g: number;
  r: number;
}): [r: number, g: number, b: number] => [
  Math.round(color.r * 255),
  Math.round(color.g * 255),
  Math.round(color.b * 255),
];

export const convert255ScaleRGBtoDecimal = (color: {
  b: number;
  g: number;
  r: number;
}): [r: number, g: number, b: number] => [
  color.r / 255,
  color.g / 255,
  color.b / 255,
];

export const formatForOklchDisplay = (oklch: Oklch): string => {
  return `${toPercent(oklch.l)} ${clean(oklch.c)} ${clean(oklch.h ?? 0, 1)}`;
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

export const toPercent = (value: number): string => `${clean(100 * value, 0)}%`;

export const formatForOklchCSS = (color: Oklch): string => {
  const { alpha, c, h, l } = color;
  let postfix = '';
  if (typeof alpha !== 'undefined' && alpha < 1) {
    postfix = ` / ${toPercent(alpha)}`;
  }
  return `oklch(${toPercent(l)} ${clean(c, 3)} ${clean(h ?? 0, 1)}${postfix})`;
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
