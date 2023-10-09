import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { isValidForBackground } from '~api/services/figma/nodes/is-valid-for-background.ts';
import { isValidForSelection } from '~api/services/figma/nodes/is-valid-for-selection.ts';
import {
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeEvent => {
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
    });

  const isSingleInvalidBackground =
    selectedNodePairs.some(isEmpty) && selectedNodePairs.length === 1;
  const areAllInvalidBackgrounds =
    selectedNodePairs.length > 1 && selectedNodePairs.every(isEmpty);

  const invalidBackground =
    isSingleInvalidBackground || areAllInvalidBackgrounds;

  return {
    colorSpace: figma.root.documentColorProfile,
    ...(invalidBackground
      ? { text: SelectionMessageTypes.invalidBackground }
      : {
          selectedNodePairs: selectedNodePairs.filter(notEmpty),
        }),
  };
};
