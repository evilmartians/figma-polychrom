import { type FigmaPaint } from '~types/figma.ts';
import { type Oklch } from 'culori/fn';

export interface UIColor {
  hex: string;
  oklch: Oklch;
}

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
