import { getSiblingsThatAreBelowByZIndex } from '~api/services/figma/intersections/get-siblings-that-are-below-by-z-index.ts';
import { traverseAndCheckIntersections } from '~api/services/figma/intersections/traverse-and-check-intersections.ts';
import { createPolychromNode } from '~api/services/figma/nodes/create-polychrom-node.ts';
import { type PolychromNode } from '~types/common.ts';

export const getIntersectingNodes = (
  selectedNode: SceneNode
): PolychromNode => {
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
  );

  const polychromPageNode = createPolychromNode(
    figma.currentPage,
    selectedNode.id
  );

  polychromPageNode.children = intersectingNodes;

  return polychromPageNode;
};
