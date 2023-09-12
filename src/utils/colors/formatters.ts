import { type Oklch, useMode } from 'culori';
import { formatCss, formatHex, formatRgb, modeRgb } from 'culori/fn';

import { type ColorSpaceDisplayModes } from '../../constants.ts';

const convertToRgb = useMode(modeRgb);

export const convertDecimalRGBto255Scale = (color: {
  b: number;
  g: number;
  r: number;
}): number[] => Object.values(color).map((value) => Math.round(value * 255));

const formatForOklchDisplay = (oklch: Oklch): string => {
  const lValue = Math.round(oklch.l * 100);
  const cValue = oklch.c === 0 ? 0 : oklch.c.toFixed(2);
  const hValue = oklch.h === 0 ? 0 : (oklch.h ?? 0).toFixed(1);

  return `${lValue}% ${cValue} ${hValue}`;
};

const formatForRgbDisplay = (oklch: Oklch): string => {
  const { b, g, r } = convertToRgb(oklch);
  return convertDecimalRGBto255Scale({ b, g, r }).join(' ');
};

export const getFormatForDisplayFunction = (
  colorSpaceDisplayMode: ColorSpaceDisplayModes
): ((oklch: Oklch) => string) => {
  const formatters = {
    HEX: formatHex,
    OKLCH: formatForOklchDisplay,
    RGB: formatForRgbDisplay,
  };

  return formatters[colorSpaceDisplayMode];
};

export const getFormatForCSSFunction = (
  colorSpaceDisplayMode: ColorSpaceDisplayModes
): ((oklch: Oklch) => string) => {
  const formatters = {
    HEX: formatHex,
    OKLCH: formatCss,
    RGB: formatRgb,
  };

  return formatters[colorSpaceDisplayMode];
};
