import { calcAPCA } from 'apca-w3';
import { apcach, type ApcachColor, apcachToCss, crTo, crToFg } from 'apcach';
import { formatCss, type Oklch } from 'culori';

import { type UIColor } from '../../../types/common.ts';
import { notEmpty } from '../../../utils/not-empty.ts';

const minLc = 60;
const toleranceLc = 2;

export interface WidgetProps {
  debug: string;
  Lc: number;
  oklchBackground: Oklch;
  oklchForeground: Oklch;
  theme: Theme;
}

interface Theme {
  background: UIColor;
  border: null | UIColor;
  foreground: UIColor;
  Lc: number;
  secondary: UIColor;
}

const fixHue = (oklchColor: Oklch | undefined): Oklch | undefined => {
  if (oklchColor == null) return undefined;

  oklchColor.h = notEmpty(oklchColor.h) ? oklchColor.h : 0;
  return oklchColor;
};

const apcachToCulori = (apcachColor: ApcachColor): Oklch => {
  return {
    alpha: apcachColor.alpha,
    c: apcachColor.chroma,
    h: apcachColor.hue,
    l: apcachColor.lightness,
    mode: 'oklch',
  };
};

const transformForegroundColor = (
  colorForeground: UIColor,
  colorBackground: UIColor
): UIColor => {
  const { oklch: oklchForeground } = colorForeground;
  const { hex: hexBackground } = colorBackground;

  const apcachLightForeground = apcach(
    crTo(hexBackground, minLc),
    oklchForeground.c,
    oklchForeground.h ?? 0
  );

  const hexLightForeground = apcachToCss(apcachLightForeground, 'hex');
  const oklchLightForeground = apcachToCulori(apcachLightForeground);

  return {
    hex: hexLightForeground,
    oklch: oklchLightForeground,
  };
};

const transformBackgroundColor = (
  colorForeground: UIColor,
  colorBackground: UIColor
): UIColor => {
  const { hex: hexForeground } = colorForeground;
  const { oklch: oklchBackground } = colorBackground;

  const apcachDarkBackground = apcach(
    crToFg(hexForeground, minLc),
    oklchBackground.c,
    oklchBackground.h ?? 0
  );

  const hexDarkBackground = apcachToCss(apcachDarkBackground, 'hex');
  const oklchDarkBackground = apcachToCulori(apcachDarkBackground);

  return {
    hex: hexDarkBackground,
    oklch: oklchDarkBackground,
  };
};

const getThemeWithBothColorsTransformed = (
  colorForeground: UIColor,
  colorBackground: UIColor
): Theme => {
  const colorTransformedForeground = transformForegroundColor(
    colorForeground,
    colorBackground
  );
  const colorTransformedBackground = transformBackgroundColor(
    colorTransformedForeground,
    colorBackground
  );
  const themeLc = Math.round(
    Math.abs(
      Number(
        calcAPCA(colorTransformedForeground.hex, colorTransformedBackground.hex)
      )
    )
  );

  const secondary = getSecondaryColor(colorTransformedBackground);

  return {
    background: colorTransformedBackground,
    border: null,
    foreground: colorTransformedForeground,
    Lc: themeLc,
    secondary,
  };
};

const getThemeWithTransformedForeground = (
  colorForeground: UIColor,
  colorBackground: UIColor
): Theme => {
  const { hex: hexBackground } = colorBackground;

  const colorTransformedForeground = transformForegroundColor(
    colorForeground,
    colorBackground
  );
  const themeLc = Math.round(
    Math.abs(Number(calcAPCA(colorTransformedForeground.hex, hexBackground)))
  );

  const secondary = getSecondaryColor(colorBackground);

  return {
    background: colorBackground,
    border: secondary,
    foreground: colorTransformedForeground,
    Lc: themeLc,
    secondary,
  };
};

const getThemeWithTransformedBackground = (
  colorForeground: UIColor,
  colorBackground: UIColor
): Theme => {
  const { hex: hexForeground } = colorForeground;

  const colorTransformedBackground = transformBackgroundColor(
    colorForeground,
    colorBackground
  );
  const themeLc = Math.round(
    Math.abs(Number(calcAPCA(hexForeground, colorTransformedBackground.hex)))
  );

  const secondary = getSecondaryColor(colorTransformedBackground);

  return {
    background: colorTransformedBackground,
    border: null,
    foreground: colorForeground,
    Lc: themeLc,
    secondary,
  };
};

/*
 * Returns a string with OKLCH color in oklch() CSS format
 */
const getSecondaryColor = (colorBackground: UIColor): UIColor => {
  const { hex, oklch } = colorBackground;

  const cssStringOklchBackground = formatCss(oklch);

  const apcachSecondaryA = apcach(
    crTo(cssStringOklchBackground, minLc),
    oklch.c,
    oklch.h ?? 0
  );

  const apcachSecondaryB = apcach(
    crTo(cssStringOklchBackground, -minLc),
    oklch.c,
    oklch.h ?? 0
  );

  const hexSecondaryA = apcachToCss(apcachSecondaryA, 'hex');
  const hexSecondaryB = apcachToCss(apcachSecondaryB, 'hex');
  const secondaryALc = Math.abs(Number(calcAPCA(hexSecondaryA, hex)));
  const secondaryBLc = Math.abs(Number(calcAPCA(hexSecondaryB, hex)));

  let oklchSecondary = apcachToCss(apcachSecondaryA, 'hex');

  if (secondaryALc < secondaryBLc) {
    oklchSecondary = apcachToCss(apcachSecondaryB, 'hex');
  }

  return {
    hex: oklchSecondary,
    oklch: apcachToCulori(apcachSecondaryA),
  };
};

export const generateUIColors = (
  foreground: UIColor,
  background: UIColor
): null | WidgetProps => {
  const oklchForeground = fixHue(foreground.oklch);
  const oklchBackground = fixHue(background.oklch);

  if (oklchForeground == null || oklchBackground == null) return null;

  const colorForeground = { hex: foreground.hex, oklch: oklchForeground };
  const colorBackground = { hex: background.hex, oklch: oklchBackground };

  const Lc = Math.abs(Number(calcAPCA(foreground.hex, background.hex)));
  const themeLc = Math.round(Lc);

  const secondary = getSecondaryColor(colorBackground);

  if (Lc > minLc) {
    // Case: the current selection exceeds the minLc
    // no transformation is needed
    return {
      debug: 'Selection > minLc',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme: {
        background: colorBackground,
        border: secondary,
        foreground: colorForeground,
        Lc: themeLc,
        secondary,
      },
    };
  }

  if (oklchForeground.l > 0.8) {
    // Case: very light, close to white, text
    // This means there’s no room to make the text lighter
    // so the only way to achieve the target Lc is to darken the BG
    // const theme = getThemeForDarkBackground(foreground, background)
    const theme = getThemeWithTransformedBackground(
      colorForeground,
      colorBackground
    );
    return {
      debug: 'Very light text, BG was darkened',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme,
    };
  } else if (oklchBackground.l < 0.3) {
    // Case: very dark, close to black, background
    // This means there’s no room to make the background darker
    // so the only way to achieve the target Lc is to lighten the text (foreground)
    // const theme = getThemeForLightForeground(foreground, background)
    const theme = getThemeWithTransformedForeground(
      colorForeground,
      colorBackground
    );
    return {
      debug: 'Very dark BG, text was lightened',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme,
    };
  } else {
    // Case: both text and background are in the middle of their lightnesses
    // The strategy here is to try to transform the BG first
    // if there’s no enough lightness then to try to transform FG...

    let theme = getThemeWithTransformedBackground(
      colorForeground,
      colorBackground
    );
    if (theme.Lc >= minLc - toleranceLc) {
      return {
        debug: 'Middle 3.1: transformed BG',
        Lc: Math.round(Lc),
        oklchBackground,
        oklchForeground,
        theme,
      };
    }

    theme = getThemeWithTransformedForeground(colorForeground, colorBackground);
    if (theme.Lc >= minLc - toleranceLc) {
      return {
        debug: 'Middle 3.2: transformed text',
        Lc: Math.round(Lc),
        oklchBackground,
        oklchForeground,
        theme,
      };
    }

    // ...If nothing worked it remains to transform both colors
    theme = getThemeWithBothColorsTransformed(colorForeground, colorBackground);

    return {
      debug: 'Middle 3.3: both transformed',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme,
    };
  }
};
