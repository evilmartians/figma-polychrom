import { type UIColor } from './common.ts';

export type FigmaPaint = SolidPaint & UIColor;

export interface FigmaNode {
  fills: FigmaPaint[];
  id: string;
}
