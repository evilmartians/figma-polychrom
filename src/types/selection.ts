import { type FigmaNode } from './figma.ts';

export interface SelectedNodes {
  intersectingNodes: FigmaNode[];
  selectedNode: FigmaNode[];
}
