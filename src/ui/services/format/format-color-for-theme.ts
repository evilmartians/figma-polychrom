import { type UIColor } from '~types/common.ts';
import { isSupportsOKLCH } from '~ui/constants.ts';
import { formatForOklchCSS } from '~utils/colors/formatters.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { formatHex8 } from 'culori/fn';

export const formatColorForTheme = (
  color: null | UIColor,
  alpha?: number
): string => {
  if (isEmpty(color)) {
    return '';
  }

  if (isSupportsOKLCH) {
    return formatForOklchCSS(color.oklch, alpha);
  }

  return notEmpty(alpha) ? formatHex8({ ...color.oklch, alpha }) : color.hex;
};
