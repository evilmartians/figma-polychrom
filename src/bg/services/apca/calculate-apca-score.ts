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
  const fgDecimalRgb = convertDecimalRGBto255Scale(fg.color);
  const bgDecimalRgb = convertDecimalRGBto255Scale(bg.color);
  const hasAlpha = notEmpty(fg.opacity) && fg.opacity < 1;

  if (colorSpace === 'DISPLAY_P3') {
    const blendedForeground = alphaBlend(
      [...fgDecimalRgb, fg.opacity ?? 1],
      bgDecimalRgb,
      true
    );

    return Math.round(
      Number(
        APCAcontrast(
          displayP3toY(
            hasAlpha
              ? convert255ScaleRGBtoDecimal({
                  b: blendedForeground[2],
                  g: blendedForeground[1],
                  r: blendedForeground[0],
                })
              : [fg.color.r, fg.color.g, fg.color.b]
          ),
          displayP3toY([bg.color.r, bg.color.g, bg.color.b])
        )
      )
    );
  } else {
    const foreground = hasAlpha
      ? alphaBlend([...fgDecimalRgb, fg.opacity ?? 1], bgDecimalRgb, true)
      : fgDecimalRgb;

    return Math.round(
      Number(APCAcontrast(sRGBtoY(foreground), sRGBtoY(bgDecimalRgb)))
    );
  }
};
