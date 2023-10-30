import { type FigmaNode } from './figma.ts';

export interface SelectedNodes {
  intersectingNodes: FigmaNode[];
  selectedNodeWithIntersectingNodes: FigmaNode[];
}
