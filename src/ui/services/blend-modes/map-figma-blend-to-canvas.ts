export const mapFigmaBlendToCanvas = (
  figmaBlend: BlendMode
): GlobalCompositeOperation => {
  const mapping: Record<BlendMode, GlobalCompositeOperation> = {
    COLOR: 'color',
    COLOR_BURN: 'color-burn',
    COLOR_DODGE: 'color-dodge',
    DARKEN: 'darken',
    DIFFERENCE: 'difference',
    EXCLUSION: 'exclusion',
    HARD_LIGHT: 'hard-light',
    HUE: 'hue',
    LIGHTEN: 'lighten',
    // unsupported
    LINEAR_BURN: 'color-burn',
    // unsupported
    LINEAR_DODGE: 'lighter',
    LUMINOSITY: 'luminosity',
    MULTIPLY: 'multiply',
    NORMAL: 'source-over',
    OVERLAY: 'overlay',
    // only for layers, not for fills
    PASS_THROUGH: 'source-over',
    SATURATION: 'saturation',
    SCREEN: 'screen',
    SOFT_LIGHT: 'soft-light',
  };

  return mapping[figmaBlend];
};
