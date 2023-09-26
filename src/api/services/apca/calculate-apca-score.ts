import { type FigmaPaint } from '~types/figma.ts';
import {
  convert255ScaleRGBtoDecimal,
  convertDecimalRGBto255Scale,
} from '~utils/colors/formatters.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { alphaBlend, APCAcontrast, displayP3toY, sRGBtoY } from 'apca-w3';

export const calculateApcaScore = (
  fg: FigmaPaint,
  bg: FigmaPaint,
  colorSpace: 'DISPLAY_P3' | 'LEGACY' | 'SRGB'
): number => {
  const fgRgb = convertDecimalRGBto255Scale(fg.color);
  const bgRgb = convertDecimalRGBto255Scale(bg.color);
  const hasAlpha = notEmpty(fg.opacity) && fg.opacity < 1;

  if (colorSpace === 'DISPLAY_P3') {
    const blendedFg = alphaBlend([...fgRgb, fg.opacity ?? 1], bgRgb, true);

    const fgY = displayP3toY(
      hasAlpha
        ? convert255ScaleRGBtoDecimal({
            b: blendedFg[2],
            g: blendedFg[1],
            r: blendedFg[0],
          })
        : [fg.color.r, fg.color.g, fg.color.b]
    );
    const bgY = displayP3toY([bg.color.r, bg.color.g, bg.color.b]);
    const contrast = APCAcontrast(fgY, bgY);

    return Math.round(Number(contrast));
  } else {
    const fgColor = hasAlpha
      ? alphaBlend([...fgRgb, fg.opacity ?? 1], bgRgb, true)
      : fgRgb;

    return Math.round(Number(APCAcontrast(sRGBtoY(fgColor), sRGBtoY(bgRgb))));
  }
};
