import { handleOpaqueBackground } from '~api/services/colors/handle-opaque-background.ts';
import { handleTransparentBackground } from '~api/services/colors/handle-transparent-background.ts';
import { getIntersectingNodesWithPage } from '~api/services/figma/intersections/get-intersecting-nodes-with-page.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { type ColorPair } from '~api/types.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const processNodeForSelection = (node: SceneNode): ColorPair | null => {
  const figmaNode = createFigmaNode(node);
  const intersectingNodes = getIntersectingNodesWithPage(node);

  if (intersectingNodes.length === 0) return null;

  const [firstIntersectingNode] = intersectingNodes;

  if (!notEmpty(firstIntersectingNode)) return null;

  if (isLayerHasTransparency(firstIntersectingNode)) {
    return handleTransparentBackground(figmaNode, intersectingNodes);
  } else {
    return handleOpaqueBackground(figmaNode, firstIntersectingNode);
  }
};
