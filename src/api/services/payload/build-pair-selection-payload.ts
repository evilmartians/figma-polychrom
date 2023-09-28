import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { isEmpty } from '~utils/not-empty.ts';

export const buildPairSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const [firstNode, secondNode] = selection;

  if (isEmpty(firstNode) || isEmpty(secondNode))
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  const firstFigmaNode = createFigmaNode(firstNode);
  const secondFigmaNode = createFigmaNode(secondNode);

  const [fg, bg] = sortNodesByLayers([firstFigmaNode, secondFigmaNode]);

  if (isEmpty(fg) || isEmpty(bg))
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs: [
      {
        intersectingNodes: [bg],
        selectedNode: fg,
      },
    ],
  };
};
