declare module 'apcach' {
  interface ContrastConfig {
    bgColor: string;
    cr: number;
    fgColor: string;
  }

  export interface ApcachColor {
    alpha: number;
    chroma: number;
    contrastConfig: ContrastConfig;
    hue: number;
    lightness: number;
  }

  interface Antagonist {
    bg?: string;
    fg?: string;
  }

  function apcach(
    contrast: ContrastConfig | number,
    chroma:
      | ((
          contrastConfig: ContrastConfig,
          hue: number,
          alpha: number
        ) => ApcachColor)
      | number,
    hue: number,
    alpha?: number
  ): ApcachColor;

  function cssToApcach(color: string, antagonist: Antagonist): ApcachColor;

  function crToBg(bgColor: string, cr: number): ContrastConfig;

  function crTo(bgColor: string, cr: number): ContrastConfig;

  function crToBlack(cr: number): ContrastConfig;

  function crToFg(fgColor: string, cr: number): ContrastConfig;

  function crToFgWhite(cr: number): ContrastConfig;

  function crToFgBlack(cr: number): ContrastConfig;

  function setContrast(
    colorInApcach: ApcachColor,
    cr: ((currentCr: number) => number) | number
  ): ApcachColor;

  function setChroma(
    colorInApcach: ApcachColor,
    c: ((currentChroma: number) => number) | number
  ): ApcachColor;

  function setHue(
    colorInApcach: ApcachColor,
    h: ((currentHue: number) => number) | number
  ): ApcachColor;

  function maxChroma(
    chromaCap?: number
  ): (
    contrastConfig: ContrastConfig,
    hue: number,
    alpha: number
  ) => ApcachColor;

  function apcachToCss(
    color: ApcachColor,
    format: 'figma-p3' | 'hex' | 'oklch' | 'p3' | 'rgb'
  ): string;

  function p3contrast(
    fgColorInCssFormat: string,
    bgColorInCssFormat: string
  ): number;

  function inP3(color: ApcachColor): boolean;

  export {
    apcach,
    apcachToCss,
    crTo,
    crToBg,
    crToBlack,
    crToFg,
    crToFgBlack,
    crToFgWhite,
    cssToApcach,
    inP3,
    maxChroma,
    p3contrast,
    setChroma,
    setContrast,
    setHue,
  };
}
