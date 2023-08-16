import { formatHex, formatHex8 } from 'culori';

import { type FigmaPaint } from '../../types/figma.ts';

interface UIColors {
  textPrimaryHex: string;
  textSecondaryAlpha10: string;
  textSecondaryAlpha60: string;
  textSecondaryHex: string;
  widgetBackgroundHex: string;
}

const generateForDarkOnLight = (
  fgFill: FigmaPaint,
  bgFill: FigmaPaint
): UIColors => {
  const widgetBackgroundOklch =
    bgFill.oklch.l < 0.9
      ? {
          ...bgFill.oklch,
          l: 0.9,
        }
      : bgFill.oklch;
  const widgetBackgroundHex = formatHex(widgetBackgroundOklch);

  const textSecondaryOklch = { ...widgetBackgroundOklch, l: 0.2 };
  const textSecondaryHex = formatHex(textSecondaryOklch);
  const textSecondaryAlpha10 = formatHex8({
    ...textSecondaryOklch,
    alpha: 0.1,
  });
  const textSecondaryAlpha60 = formatHex8({
    ...textSecondaryOklch,
    alpha: 0.6,
  });

  const textPrimary =
    fgFill.oklch.l > 0.2 ? { ...fgFill.oklch, l: 0.2 } : fgFill.oklch;
  const textPrimaryHex = formatHex(textPrimary);

  return {
    textPrimaryHex,
    textSecondaryAlpha10,
    textSecondaryAlpha60,
    textSecondaryHex,
    widgetBackgroundHex,
  };
};

const generateForLightOnDark = (
  fgFill: FigmaPaint,
  bgFill: FigmaPaint
): UIColors => {
  const widgetBackgroundOklch =
    bgFill.oklch.l > 0.2
      ? {
          ...bgFill.oklch,
          l: 0.2,
        }
      : bgFill.oklch;
  const widgetBackgroundHex = formatHex(widgetBackgroundOklch);

  const textSecondaryOklch = { ...widgetBackgroundOklch, l: 0.9 };
  const textSecondaryHex = formatHex(textSecondaryOklch);
  const textSecondaryAlpha10 = formatHex8({
    ...textSecondaryOklch,
    alpha: 0.1,
  });
  const textSecondaryAlpha60 = formatHex8({
    ...textSecondaryOklch,
    alpha: 0.6,
  });

  const textPrimary =
    fgFill.oklch.l < 0.9 ? { ...fgFill.oklch, l: 0.9 } : fgFill.oklch;
  const textPrimaryHex = formatHex(textPrimary);

  return {
    textPrimaryHex,
    textSecondaryAlpha10,
    textSecondaryAlpha60,
    textSecondaryHex,
    widgetBackgroundHex,
  };
};

export const generateUIColors = (
  fgFill: FigmaPaint,
  bgFill: FigmaPaint
): UIColors => {
  if (fgFill.oklch.l > bgFill.oklch.l) {
    return generateForLightOnDark(fgFill, bgFill);
  } else {
    return generateForDarkOnLight(fgFill, bgFill);
  }
};
