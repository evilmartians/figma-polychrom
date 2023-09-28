import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { isLayerVisible } from '~utils/is-layer-visible.ts';

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const selectedNodePairs = selection
    .map((selectedNode) => ({
      intersectingNodes: getIntersectingNodes(selectedNode),
      selectedNode: createFigmaNode(selectedNode),
    }))
    .filter((pair) => isLayerVisible(pair.selectedNode));

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs,
  };
};
