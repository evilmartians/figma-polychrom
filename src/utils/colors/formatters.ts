import { notEmpty } from '~utils/not-empty.ts';
import { formatHex, formatHex8, modeRgb, type Oklch, useMode } from 'culori/fn';

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
  return `${toPercent(oklch.l)} ${clearValue(oklch.c)} ${clearValue(
    oklch.h ?? 0,
    1
  )}`;
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
  const [r255, g255, b255] = convertDecimalRGBto255Scale({ b, g, r });
  let postfix = '';

  if (notEmpty(opacity) && opacity < 1) {
    postfix = ` / ${toPercent(opacity)}`;
  }

  return `rgb(${r255} ${g255} ${b255}${postfix})`;
};

export const formatForHexCSS = (color: Oklch, opacity?: number): string => {
  if (notEmpty(opacity) && opacity < 1) {
    return formatHex8({
      alpha: opacity,
      ...color,
      mode: 'oklch',
    });
  }

  return formatHex({
    alpha: opacity,
    ...color,
    mode: 'oklch',
  });
};

export const getFormatterForCSS = (
  colorSpaceDisplayMode: ColorSpaceDisplayModes
): ((oklch: Oklch, opacity?: number) => string) => {
  const formatters = {
    HEX: formatForHexCSS,
    OKLCH: formatForOklchCSS,
    RGB: formatForRGBCSS,
  };

  return formatters[colorSpaceDisplayMode];
};
