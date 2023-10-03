import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { isValidForBackground } from '~api/services/figma/nodes/is-valid-for-background.ts';
import { isValidForSelection } from '~api/services/figma/nodes/is-valid-for-selection.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const selectedNodePairs = selection
    .filter(isValidForSelection)
    .map((selectedNode) => {
      const intersectingNodes = getIntersectingNodes(selectedNode);

      if (isValidForBackground(intersectingNodes)) {
        return {
          intersectingNodes: getIntersectingNodes(selectedNode),
          selectedNode: [createFigmaNode(selectedNode)],
        };
      } else {
        return null;
      }
    })
    .filter(notEmpty);

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs,
  };
};
