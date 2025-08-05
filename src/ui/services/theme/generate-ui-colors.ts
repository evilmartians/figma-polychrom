import { type UIColor } from '~types/common.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
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
const toleranceLc = 4;
const borderLcThreshold = 10;

export interface WidgetProps {
  debug: string;
  Lc: number;
  oklchBg: Oklch;
  oklchFg: Oklch;
  theme: Theme;
}

export interface Theme {
  bg: UIColor;
  bgBorder: null | UIColor;
  borderOriginal: null | UIColor;
  fg: UIColor;
  fgBorder: null | UIColor;
  Lc: number;
  secondary: UIColor;
}

const fixHue = (oklchColor: null | Oklch): null | Oklch => {
  if (isEmpty(oklchColor)) return null;

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

const transformFgColor = (colorFg: UIColor, colorBg: UIColor): UIColor => {
  const { oklch: oklchFg } = colorFg;
  const { hex: hexBg } = colorBg;

  const apcachLightFg = apcach(
    crTo(hexBg, minLc),
    maxChroma(oklchFg.c),
    oklchFg.h ?? 0
  );

  const hexLightFg = apcachToCss(apcachLightFg, 'hex');
  const oklchLightFg = apcachToCulori(apcachLightFg);

  return {
    hex: hexLightFg,
    oklch: oklchLightFg,
  };
};

const transformBgColor = (colorFg: UIColor, colorBg: UIColor): UIColor => {
  const { hex: hexFg } = colorFg;
  const { oklch: oklchBg } = colorBg;

  const apcachDarkBg = apcach(
    crToFg(hexFg, minLc),
    maxChroma(oklchBg.c),
    oklchBg.h ?? 0
  );

  const hexDarkBg = apcachToCss(apcachDarkBg, 'hex');
  const oklchDarkBg = apcachToCulori(apcachDarkBg);

  return {
    hex: hexDarkBg,
    oklch: oklchDarkBg,
  };
};

const getThemeWithBothColorsTransformed = (
  colorFg: UIColor,
  colorBg: UIColor
): Theme => {
  const colorTransformedBg = transformBgColor(colorFg, colorBg);
  const colorTransformedFg = transformFgColor(colorFg, colorTransformedBg);
  const themeLc = Math.round(
    Math.abs(Number(calcAPCA(colorTransformedFg.hex, colorTransformedBg.hex)))
  );

  const secondary = getSecondaryColor(colorTransformedBg);

  return {
    bg: colorTransformedBg,
    bgBorder: colorBg,
    borderOriginal: colorBg,
    fg: colorTransformedFg,
    fgBorder: colorFg,
    Lc: themeLc,
    secondary,
  };
};

const getThemeWithTransformedFg = (
  colorFg: UIColor,
  colorBg: UIColor,
  Lc: number
): Theme => {
  const { hex: hexBg } = colorBg;

  const colorTransformedFg = transformFgColor(colorFg, colorBg);
  const themeLc = Math.round(
    Math.abs(Number(calcAPCA(colorTransformedFg.hex, hexBg)))
  );

  const secondary = getSecondaryColor(colorBg);

  const fgBorder = Lc < borderLcThreshold ? colorTransformedFg : colorFg;

  return {
    bg: colorBg,
    bgBorder: secondary,
    borderOriginal: secondary,
    fg: colorTransformedFg,
    fgBorder,
    Lc: themeLc,
    secondary,
  };
};

const getThemeWithTransformedBg = (
  colorFg: UIColor,
  colorBg: UIColor
): Theme => {
  const { hex: hexFg } = colorFg;

  const colorTransformedBg = transformBgColor(colorFg, colorBg);
  const themeLc = Math.round(
    Math.abs(Number(calcAPCA(hexFg, colorTransformedBg.hex)))
  );

  const secondary = getSecondaryColor(colorTransformedBg);

  return {
    bg: colorTransformedBg,
    bgBorder: colorBg,
    borderOriginal: colorBg,
    fg: colorFg,
    fgBorder: colorFg,
    Lc: themeLc,
    secondary,
  };
};

/*
 * Returns a string with OKLCH color in oklch() CSS format
 */
const getSecondaryColor = (colorBg: UIColor): UIColor => {
  const { hex, oklch } = colorBg;

  const cssStringOklchBg = formatCss(oklch);

  const apcachSecondaryA = apcach(
    crTo(cssStringOklchBg, minLc, 'apca', 'lighter'),
    maxChroma(oklch.c),
    oklch.h ?? 0
  );

  const apcachSecondaryB = apcach(
    crTo(cssStringOklchBg, minLc, 'apca', 'darker'),
    maxChroma(oklch.c),
    oklch.h ?? 0
  );

  const hexSecondaryA = apcachToCss(apcachSecondaryA, 'hex');
  const hexSecondaryB = apcachToCss(apcachSecondaryB, 'hex');
  const secondaryALc = Math.abs(Number(calcAPCA(hexSecondaryA, hex)));
  const secondaryBLc = Math.abs(Number(calcAPCA(hexSecondaryB, hex)));

  // Logic: if both options are greater than or equal to minLc
  // then prefer the option with higher Chroma
  if (
    secondaryALc >= minLc - toleranceLc &&
    secondaryBLc >= minLc - toleranceLc
  ) {
    if (apcachSecondaryA.chroma >= apcachSecondaryB.chroma) {
      return { hex: hexSecondaryA, oklch: apcachToCulori(apcachSecondaryA) };
    } else {
      return { hex: hexSecondaryB, oklch: apcachToCulori(apcachSecondaryB) };
    }
  }

  // Else prefer the option with greater contrast
  if (secondaryALc >= secondaryBLc) {
    return { hex: hexSecondaryA, oklch: apcachToCulori(apcachSecondaryA) };
  }

  return { hex: hexSecondaryB, oklch: apcachToCulori(apcachSecondaryB) };
};

const getThemeWithMaxLc = (themes: Theme[]): null | Theme => {
  const Lcs = themes.map((theme) => {
    return theme.Lc;
  });

  const max = Math.max(...Lcs);

  const theme = themes.find((theme) => theme.Lc === max);

  return notEmpty(theme) ? theme : null;
};

export const generateUIColors = (
  fg: UIColor,
  bg: UIColor
): undefined | WidgetProps => {
  const oklchFg = fixHue(fg.oklch);
  const oklchBg = fixHue(bg.oklch);

  if (isEmpty(oklchFg) || isEmpty(oklchBg)) return undefined;

  const colorFg = { hex: fg.hex, oklch: oklchFg };
  const colorBg = { hex: bg.hex, oklch: oklchBg };

  const Lc = Math.abs(Number(calcAPCA(fg.hex, bg.hex)));
  const themeLc = Math.round(Lc);

  const secondary = getSecondaryColor(colorBg);

  if (Lc > minLc - toleranceLc) {
    // Case: the current selection exceeds the minLc
    // no transformation is needed
    return {
      debug: 'Selection > minLc',
      Lc: Math.round(Lc),
      oklchBg,
      oklchFg,
      theme: {
        bg: colorBg,
        bgBorder: secondary,
        borderOriginal: secondary,
        fg: colorFg,
        fgBorder: colorFg,
        Lc: themeLc,
        secondary,
      },
    };
  }

  // The new approach is to try to keep the BG the same as long as possible
  // because its impact into user’s impression is the highest

  const themes = [];
  // CASE 1: Thus we change the FG first
  let theme = getThemeWithTransformedFg(colorFg, colorBg, Lc);

  if (theme.Lc >= minLc - toleranceLc) {
    return {
      debug: 'Case 1: transformed text',
      Lc: Math.round(Lc),
      oklchBg,
      oklchFg,
      theme,
    };
  } else {
    themes.push(theme);
  }

  // CASE 2: If the result contrast isn’t good enough, let’s change the BG
  theme = getThemeWithTransformedBg(colorFg, colorBg);

  if (theme.Lc >= minLc - toleranceLc) {
    return {
      debug: 'Case 2: transformed BG',
      Lc: Math.round(Lc),
      oklchBg,
      oklchFg,
      theme,
    };
  } else {
    themes.push(theme);
  }

  // If nothing worked, it’s time to change both and end there
  theme = getThemeWithBothColorsTransformed(colorFg, colorBg);

  themes.push(theme);

  const themeWithMaxLc = getThemeWithMaxLc(themes);

  if (notEmpty(themeWithMaxLc)) {
    return {
      debug: 'Case 3: transformed both',
      Lc: Math.round(Lc),
      oklchBg,
      oklchFg,
      theme: themeWithMaxLc,
    };
  } else {
    return undefined;
  }
};
