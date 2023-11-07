import { notEmpty } from '~utils/not-empty.ts';
import { type CSSProperties } from 'react';

export const mapFigmaBlendToCanvas = (
  figmaBlend?: BlendMode
): CSSProperties['mixBlendMode'] => {
  const mapping: Record<BlendMode, CSSProperties['mixBlendMode']> = {
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
    LINEAR_DODGE: 'plus-lighter',
    LUMINOSITY: 'luminosity',
    MULTIPLY: 'multiply',
    NORMAL: 'normal',
    OVERLAY: 'overlay',
    // only for layers, not for fills
    PASS_THROUGH: undefined,
    SATURATION: 'saturation',
    SCREEN: 'screen',
    SOFT_LIGHT: 'soft-light',
  };

  return notEmpty(figmaBlend) ? mapping[figmaBlend] : undefined;
};
