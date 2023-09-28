import { convertDecimalRGBto255Scale } from '~utils/colors/formatters.ts';
import { APCAcontrast, displayP3toY, sRGBtoY } from 'apca-w3';

export const calculateApcaScore = (
  fg: RGB,
  bg: RGB,
  colorSpace: 'DISPLAY_P3' | 'LEGACY' | 'SRGB'
): number => {
  if (colorSpace === 'DISPLAY_P3') {
    const fgY = displayP3toY([fg.r, fg.g, fg.b]);
    const bgY = displayP3toY([bg.r, bg.g, bg.b]);
    const contrast = APCAcontrast(fgY, bgY);

    return Math.round(Number(contrast));
  } else {
    const fgDecimal = convertDecimalRGBto255Scale(fg);
    const bgDecimal = convertDecimalRGBto255Scale(bg);

    return Math.round(
      Number(
        APCAcontrast(
          sRGBtoY([fgDecimal.r, fgDecimal.g, fgDecimal.b]),
          sRGBtoY([bgDecimal.r, bgDecimal.g, bgDecimal.b])
        )
      )
    );
  }
};
