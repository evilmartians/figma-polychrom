import { type UIColor } from '~types/common.ts';

export type FigmaPaint = Paint | (SolidPaint & UIColor);

export type FigmaColorSpace = 'DISPLAY_P3' | 'LEGACY' | 'SRGB';
