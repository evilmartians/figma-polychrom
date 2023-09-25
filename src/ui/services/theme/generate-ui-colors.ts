import { type UIColor } from '~types/common.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { calcAPCA } from 'apca-w3';
import {
  apcach,
  type ApcachColor,
  apcachToCss,
  crTo,
  crToFg,
  maxChroma,
} from 'apcach';
import { formatCss, type Oklch } from 'culori/fn';

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
  if (!notEmpty(oklchColor)) return undefined;

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
    maxChroma(oklchForeground.c),
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
  const { hex: hexForeground, oklch } = colorForeground;
  const { oklch: oklchBackground } = colorBackground;

  const apcachDarkBackground = apcach(
    crToFg(hexForeground, minLc),
    maxChroma(oklch.c),
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
  const colorTransformedBackground = transformBackgroundColor(
    colorForeground,
    colorBackground
  );
  const colorTransformedForeground = transformForegroundColor(
    colorForeground,
    colorTransformedBackground
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
    crTo(cssStringOklchBackground, minLc, 'apca', 'lighter'),
    maxChroma(oklch.c),
    oklch.h ?? 0
  );

  const apcachSecondaryB = apcach(
    crTo(cssStringOklchBackground, minLc, 'apca', 'darker'),
    maxChroma(oklch.c),
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

const getThemeWithMaxLc = (themes: Theme[]): Theme | undefined => {
  const Lcs = themes.map((theme) => {
    return theme.Lc;
  });

  const max = Math.max(...Lcs);

  return themes.find((theme) => theme.Lc === max);
};

export const generateUIColors = (
  foreground: UIColor,
  background: UIColor
): null | WidgetProps => {
  const oklchForeground = fixHue(foreground.oklch);
  const oklchBackground = fixHue(background.oklch);

  if (!notEmpty(oklchForeground) || !notEmpty(oklchBackground)) return null;

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

  // The new approach is to try to keep the BG the same as long as possible
  // because its impact into user’s impression is the highest

  const themes = [];
  // CASE 1: Thus we change the FG first
  let theme = getThemeWithTransformedForeground(
    colorForeground,
    colorBackground
  );

  if (theme.Lc >= minLc - toleranceLc) {
    return {
      debug: 'Case 1: transformed text',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme,
    };
  } else {
    themes.push(theme);
  }

  // CASE 2: If the result contrast isn’t good enough, let’s change the BG
  theme = getThemeWithTransformedBackground(colorForeground, colorBackground);

  if (theme.Lc >= minLc - toleranceLc) {
    return {
      debug: 'Case 2: transformed BG',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme,
    };
  } else {
    themes.push(theme);
  }

  // If nothing worked, it’s time to change both and end there
  theme = getThemeWithBothColorsTransformed(colorForeground, colorBackground);

  themes.push(theme);

  const themeWithMaxLc = getThemeWithMaxLc(themes);

  if (notEmpty(themeWithMaxLc)) {
    return {
      debug: 'Case 3: transformed both',
      Lc: Math.round(Lc),
      oklchBackground,
      oklchForeground,
      theme: themeWithMaxLc,
    };
  } else {
    return null;
  }
};
