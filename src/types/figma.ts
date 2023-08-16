import { type Oklch } from 'culori';

export type FigmaPaint = SolidPaint & {
  hex: string;
  oklch: Oklch;
};

export interface FigmaNode {
  fills: readonly FigmaPaint[];
  id: string;
}
