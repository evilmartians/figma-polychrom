import { type Oklch } from 'culori/fn';

export interface ContrastConclusion {
  apca: number;
  bg: { hex: string; isBlended: boolean; oklch: Oklch };
  fg: { hex: string; isBlended: boolean; oklch: Oklch };
  id: string;
}

const prefix = '--polychrom-theme-';

export enum ThemeVariablesKeys {
  bg = `${prefix}bg`,
  bgBorder = `${prefix}bg-border`,
  borderOriginal = `${prefix}border-original`,
  fg = `${prefix}fg`,
  fg24 = `${prefix}fg-24`,
  fg70 = `${prefix}fg-70`,
  fgBorder = `${prefix}fg-border`,
  secondary = `${prefix}secondary`,
  secondary12 = `${prefix}secondary-12`,
  secondary16 = `${prefix}secondary-16`,
  secondary24 = `${prefix}secondary-24`,
}
