import { type FigmaNode } from './figma.ts';

export interface SelectionChangeMessage {
  selectedNodes: readonly SceneNode[];
  selectedNodesAndTheirBackgrounds: SelectionFgNodesAndBgNodes[];
}

export interface SelectionFgNodesAndBgNodes {
  apca: null | number;
  bgNode: FigmaNode;
  selectedNode: FigmaNode;
}
