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

  function crTo(bgColor: string, cr: number): ContrastConfig;

  function crToFg(fgColor: string, cr: number): ContrastConfig;

  function apcachToCss(
    color: ApcachColor,
    format: 'figma-p3' | 'hex' | 'oklch' | 'p3' | 'rgb'
  ): string;

  export { apcach, apcachToCss, crTo, crToFg };
}
