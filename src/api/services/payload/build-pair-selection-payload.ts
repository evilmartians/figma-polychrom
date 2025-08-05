import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createPolychromNode } from '~api/services/figma/nodes/create-polychrom-node.ts';
import { hasOnlyValidBlendModes } from '~api/services/figma/nodes/has-only-valid-blend-modes.ts';
import { isValidForBackground } from '~api/services/figma/nodes/is-valid-for-background.ts';
import { isValidForSelection } from '~api/services/figma/nodes/is-valid-for-selection.ts';
import { mapPolychromNodeTree } from '~api/services/figma/nodes/map-tree.ts';
import {
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { sortByDepthAndOrder } from '~utils/figma/sort-by-depth-and-order.ts';
import { isEmpty } from '~utils/not-empty.ts';

import { TwoNodesSelectionPairId } from '../../../constants.ts';

export const buildPairSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeEvent => {
  const [firstNode, secondNode] = selection;

  if (isEmpty(firstNode) || isEmpty(secondNode))
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  const firstPolychromNode = createPolychromNode(firstNode);
  const secondPolychromNode = createPolychromNode(secondNode);

  const [fg, bg] = sortByDepthAndOrder([
    firstPolychromNode,
    secondPolychromNode,
  ]);

  if (isEmpty(fg) || isEmpty(bg))
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  const fgSceneNode = fg.id === firstPolychromNode.id ? firstNode : secondNode;
  const bgSceneNode = bg.id === firstPolychromNode.id ? firstNode : secondNode;

  if (!isValidForBackground(getIntersectingNodes(bgSceneNode))) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.invalidBackground,
    };
  }

  if (!hasOnlyValidBlendModes(bg) || !hasOnlyValidBlendModes(fg)) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.unprocessedBlendModes,
    };
  }

  if (!isValidForSelection(fgSceneNode))
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  // return synthetic pair of separate collected nodes for the bg and fg
  // this is the case when the user selects two nodes and wants to build contrast between them
  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs: [
      {
        blendMode: 'NORMAL',
        children: [
          mapPolychromNodeTree(getIntersectingNodes(bgSceneNode), (node) => ({
            ...node,
            isSelected: false,
          })),
          mapPolychromNodeTree(getIntersectingNodes(fgSceneNode), (node) => ({
            ...node,
            isSelected: true,
          })),
        ],
        fills: [],
        id: TwoNodesSelectionPairId,
        name: TwoNodesSelectionPairId,
        nestingLevel: 0,
        parents: [],
      },
    ],
  };
};
