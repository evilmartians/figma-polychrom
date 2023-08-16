import { type FigmaNode } from '../../types/common';

export const getClosestNode = (nodes: FigmaNode[]): FigmaNode | null => {
  const [firstNode] = nodes;
  return firstNode !== undefined ? firstNode : null;
};
