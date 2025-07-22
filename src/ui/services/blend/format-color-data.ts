import { formatHex, modeOklch, type Oklch, useMode } from 'culori/fn';

const convertToOklch = useMode(modeOklch)

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
