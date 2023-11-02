import { converter } from 'culori';
import { formatHex, type Oklch } from 'culori/fn';

const convertToOklch = converter('oklch');

export const formatColorData = (
  color: RGB,
  isBlended: boolean
): {
  hex: string;
  isBlended: boolean;
  oklch: Oklch;
} => ({
  hex: formatHex({ ...color, mode: 'rgb' }),
  isBlended,
  oklch: convertToOklch({ ...color, mode: 'rgb' }, 'oklch'),
});
