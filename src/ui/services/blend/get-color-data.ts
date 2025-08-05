import { convert255ScaleRGBtoDecimal } from '~utils/colors/formatters.ts';
import { isEmpty } from '~utils/not-empty.ts';

export interface ColorData {
  alpha: number;
  b: number;
  g: number;
  r: number;
}

export const getColorData = (fill: Uint8ClampedArray): ColorData | null => {
  const [r, g, b, alpha] = fill;

  if (isEmpty(r) || isEmpty(g) || isEmpty(b)) return null;

  return convert255ScaleRGBtoDecimal({ alpha, b, g, r });
};
