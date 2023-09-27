import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { getComputedNodeFill } from '~api/services/colors/get-computed-node-fill.ts';
import { blendLayersColors } from '~api/services/figma/blend/blend-layers-colors.ts';
import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { type SelectedNodes } from '~types/selection.ts';
import { getFirstVisibleNodeFill } from '~utils/figma/get-first-visible-node-fill.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';

export const processNodeFromMultipleSelection = (
  selectedNode: SceneNode
): null | SelectedNodes => {
  const fgNode = createFigmaNode(selectedNode);
  const intersectingNodes = getIntersectingNodes(selectedNode);

  if (intersectingNodes.length === 0) return null;

  const [firstIntersectingNode] = intersectingNodes;

  if (isEmpty(firstIntersectingNode)) return null;

  const fgFill = getComputedNodeFill(fgNode);

  if (isEmpty(fgFill)) return null;

  if (isLayerHasTransparency(firstIntersectingNode)) {
    return handleTransparentBackground(
      selectedNode.id,
      fgFill,
      intersectingNodes
    );
  } else {
    return handleOpaqueBackground(
      selectedNode.id,
      fgFill,
      firstIntersectingNode
    );
  }
};

export const handleOpaqueBackground = (
  id: string,
  fgFill: FigmaPaint,
  firstIntersectingNode: FigmaNode
): null | SelectedNodes => {
  const bgFill = getFirstVisibleNodeFill(firstIntersectingNode.fills);

  if (notEmpty(fgFill) && notEmpty(bgFill))
    return buildColorsPair(id, fgFill, bgFill);

  return null;
};

export const handleTransparentBackground = (
  id: string,
  fgFill: FigmaPaint,
  intersectingNodes: FigmaNode[]
): null | SelectedNodes => {
  const blendedBgColor = blendLayersColors(intersectingNodes);

  if (notEmpty(fgFill) && notEmpty(blendedBgColor))
    return buildColorsPair(id, fgFill, blendedBgColor);

  return null;
};
