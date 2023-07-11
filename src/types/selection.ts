import { type FigmaNode } from './figma.ts';

export interface SelectedNodes {
  apca: null | number;
  bgNode: FigmaNode;
  selectedNode: FigmaNode;
}
