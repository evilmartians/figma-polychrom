import { converter, formatHex } from 'culori';

import { type FigmaPaint } from '../../types/common.ts';

const convertToOklch = converter('oklch');

export const createFigmaPaint = (
  color: RGB,
  opacity: number = 1
): FigmaPaint => {
  return {
    color,
    hex: formatHex({ ...color, mode: 'rgb' }),
    oklch: convertToOklch({ ...color, mode: 'rgb' }),
    opacity,
    type: 'SOLID',
  };
};
