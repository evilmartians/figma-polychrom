import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { isNodeVisible } from '~api/services/figma/nodes/is-node-visible.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const selectedNodePairs = selection
    .map((selectedNode) => ({
      intersectingNodes: getIntersectingNodes(selectedNode),
      selectedNode: createFigmaNode(selectedNode),
    }))
    .filter((pair) => isNodeVisible(pair.selectedNode));

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs,
  };
};
