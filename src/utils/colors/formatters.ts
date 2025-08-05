import { notEmpty } from '~utils/not-empty.ts';
import { formatHex, modeRgb, type Oklch, useMode } from 'culori/fn';

import { type ColorSpaceDisplayModes } from '../../constants.ts';

const convertToRgb = useMode(modeRgb);

export const convertDecimalRGBto255Scale = (color: {
  b: number;
  g: number;
  r: number;
}): { b: number; g: number; r: number } => {
  const { b, g, r } = color;
  return {
    b: Math.round(b * 255),
    g: Math.round(g * 255),
    r: Math.round(r * 255),
  };
};

export const convert255ScaleRGBtoDecimal = (color: {
  alpha?: number;
  b: number;
  g: number;
  r: number;
}): { alpha: number; b: number; g: number; r: number } => {
  const { alpha, b, g, r } = color;

  return { alpha: (alpha ?? 255) / 255, b: b / 255, g: g / 255, r: r / 255 };
};

export const formatForOklchDisplay = (oklch: Oklch): string => {
  return `${toPercent(oklch.l)} ${clearValue(oklch.c)} ${clearValue(
    oklch.h ?? 0,
    1
  )}`;
};

export const formatForRgbDisplay = (oklch: Oklch): string => {
  const { b, g, r } = convertToRgb(oklch);
  return `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`;
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

export const clearValue = (value: number, precision = 2): number =>
  Math.round(parseFloat((value * 10 ** precision).toFixed(precision))) /
  10 ** precision;

export const toPercent = (value: number): string =>
  `${clearValue(100 * value, 0)}%`;

export const formatForOklchCSS = (color: Oklch, opacity?: number): string => {
  const { c, h, l } = color;
  let postfix = '';

  if (notEmpty(opacity) && opacity < 1) {
    postfix = ` / ${toPercent(opacity)}`;
  }

  return `oklch(${toPercent(l)} ${clearValue(c, 3)} ${clearValue(
    h ?? 0,
    1
  )}${postfix})`;
};

export const formatForRGBCSS = (color: Oklch, opacity?: number): string => {
  const { b, g, r } = convertToRgb(color);
  const {
    b: b255,
    g: g255,
    r: r255,
  } = convertDecimalRGBto255Scale({ b, g, r });
  let postfix = '';

  if (notEmpty(opacity) && opacity < 1) {
    postfix = ` / ${toPercent(opacity)}`;
  }

  return `rgb(${r255} ${g255} ${b255}${postfix})`;
};

export const formatForHexCSS = (color: Oklch): string => {
  return formatHex({
    ...color,
    mode: 'oklch',
  });
};

export const getFormatterForCSS = (
  colorSpaceDisplayMode: ColorSpaceDisplayModes
): ((oklch: Oklch) => string) => {
  const formatters = {
    HEX: formatForHexCSS,
    OKLCH: formatForOklchCSS,
    RGB: formatForRGBCSS,
  };

  return formatters[colorSpaceDisplayMode];
};
