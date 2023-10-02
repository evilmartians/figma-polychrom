import { areNodesIntersecting } from '~api/services/figma/intersections/are-nodes-intersecting.ts';
import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
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

  const fgSceneNode = fg.id === firstFigmaNode.id ? firstNode : secondNode;
  const bgSceneNode = bg.id === firstFigmaNode.id ? firstNode : secondNode;

  console.log(areNodesIntersecting(firstNode, secondNode));

  if (areNodesIntersecting(firstNode, secondNode)) {
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [
        {
          intersectingNodes: getIntersectingNodes(fgSceneNode),
          selectedNode: [fg],
        },
      ],
    };
  } else {
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [
        {
          intersectingNodes: [bg, ...getIntersectingNodes(bgSceneNode)],
          selectedNode: [fg, ...getIntersectingNodes(fgSceneNode)],
        },
      ],
    };
  }
};
