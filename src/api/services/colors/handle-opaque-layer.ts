import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { blendFills } from '~api/services/figma/blend/blend-layers-colors.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { type ColorPair } from '~api/types.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';

export const handleOpaqueLayer = (
  selectedNode: FigmaNode,
  firstIntersectingNode: FigmaNode
): ColorPair | null => {
  const bgFill = getActualNodeFill(firstIntersectingNode.fills);

  const isFgHasTransparency = isLayerHasTransparency(selectedNode);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendFills(selectedNode.fills);
  } else {
    fgFill = getActualNodeFill(selectedNode.fills);
  }

  if (fgFill == null || bgFill == null) return null;

  return buildColorsPair(selectedNode.id, fgFill, bgFill);
};
