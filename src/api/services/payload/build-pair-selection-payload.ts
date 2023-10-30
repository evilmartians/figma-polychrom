import { areNodesIntersecting } from '~api/services/figma/intersections/are-nodes-intersecting.ts';
import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
// import { hasOnlyValidBlendModes } from '~api/services/figma/nodes/has-only-valid-blend-modes.ts';
import { isValidForBackground } from '~api/services/figma/nodes/is-valid-for-background.ts';
import { isValidForSelection } from '~api/services/figma/nodes/is-valid-for-selection.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import {
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { isEmpty } from '~utils/not-empty.ts';

export const buildPairSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeEvent => {
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

  if (!isValidForBackground([bg])) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.invalidBackground,
    };
  }

  // if (!hasOnlyValidBlendModes([bg, fg])) {
  //   return {
  //     colorSpace: figma.root.documentColorProfile,
  //     text: SelectionMessageTypes.unprocessedBlendModes,
  //   };
  // }

  const fgSceneNode = fg.id === firstFigmaNode.id ? firstNode : secondNode;
  const bgSceneNode = bg.id === firstFigmaNode.id ? firstNode : secondNode;

  if (!isValidForSelection(fgSceneNode))
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  if (areNodesIntersecting(bgSceneNode, fgSceneNode)) {
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [
        {
          intersectingNodes: getIntersectingNodes(fgSceneNode),
          selectedNodeWithIntersectingNodes: [fg],
        },
      ],
    };
  } else {
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [
        {
          intersectingNodes: [bg, ...getIntersectingNodes(bgSceneNode)],
          selectedNodeWithIntersectingNodes: [
            fg,
            ...getIntersectingNodes(fgSceneNode),
          ],
        },
      ],
    };
  }
};
