import { type FigmaColorSpace, type FigmaPaint } from '~types/figma.ts';
import { isSupportsOKLCH } from '~ui/constants.ts';
import { formatHex } from 'culori/fn';

export const determineFillStyle = (
  fill: FigmaPaint,
  colorSpace: FigmaColorSpace
): string | undefined => {
  if (fill.type === 'SOLID') {
    const { b, g, r } = fill.color;

    if (colorSpace === 'DISPLAY_P3' && isSupportsOKLCH) {
      return `color(display-p3 ${r} ${g} ${b})`;
    }

    return formatHex({ b, g, mode: 'rgb', r });
  }
};
