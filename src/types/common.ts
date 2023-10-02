import { type Oklch } from 'culori/fn';

export interface UIColor {
  hex: string;
  oklch: Oklch;
}

export type ColorSpace = 'DISPLAY_P3' | 'LEGACY' | 'SRGB';
