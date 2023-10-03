import { getSiblingsThatAreBelowByZIndex } from '~api/services/figma/intersections/get-siblings-that-are-below-by-z-index.ts';
import { traverseAndCheckIntersections } from '~api/services/figma/intersections/traverse-and-check-intersections.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import { type FigmaNode } from '~types/figma.ts';

export const getIntersectingNodes = (selectedNode: SceneNode): FigmaNode[] => {
  const currentPageNodes = Array.from(figma.currentPage.children);
  const isNodeInRoot = currentPageNodes.some(
    (node) => node.id === selectedNode.id
  );
  const lookUpNodes = isNodeInRoot
    ? getSiblingsThatAreBelowByZIndex(selectedNode, currentPageNodes)
    : currentPageNodes;

  const intersectingNodes = traverseAndCheckIntersections(
    lookUpNodes,
    selectedNode
  ).map(createFigmaNode);

  return [
    ...sortNodesByLayers(intersectingNodes),
    createFigmaNode(figma.currentPage),
  ];
};
