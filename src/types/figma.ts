import { type UIColor } from '~types/common.ts';

export type FigmaPaint = SolidPaint & UIColor;

export interface FigmaNode {
  fills: FigmaPaint[];
  id: string;
  name: string;
  nestingLevel: number;
  opacity?: number;
  parents: readonly SceneNode[];
  visible?: boolean;
  zIndex?: number;
}
