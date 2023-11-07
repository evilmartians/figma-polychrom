import { type UIColor } from '~types/common.ts';

export type FigmaPaint = Paint | (SolidPaint & UIColor);

export interface PolychromNode {
  blendMode: BlendMode;
  children: PolychromNode[];
  fills: FigmaPaint[];
  id: string;
  isSelected?: boolean;
  name: string;
  nestingLevel: number;
  opacity?: number;
  parents: readonly SceneNode[];
  visible?: boolean;
  zIndex?: number;
}
