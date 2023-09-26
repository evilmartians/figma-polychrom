import { traverseAndCheckIntersections } from '~api/services/figma/intersections/traverse-and-check-intersections.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import { type FigmaNode } from '~types/figma.ts';

export const getIntersectingNodesWithPage = (node: SceneNode): FigmaNode[] => {
  const intersectingNodes = traverseAndCheckIntersections(
    Array.from(figma.currentPage.children),
    node
  ).map(createFigmaNode);

  return [
    ...sortNodesByLayers(intersectingNodes),
    createFigmaNode(figma.currentPage),
  ];
};
