import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import {
  blendFills,
  blendLayersColors,
} from '~api/services/figma/blend/blend-layers-colors.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { type ColorPair } from '~api/types.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const handleTransparentLayer = (
  selectedNode: FigmaNode,
  intersectingNodes: FigmaNode[]
): ColorPair | null => {
  const blendedBgColor = blendLayersColors(intersectingNodes);

  const isFgHasTransparency = isLayerHasTransparency(selectedNode);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendFills(selectedNode.fills);
  } else {
    fgFill = getActualNodeFill(selectedNode.fills);
  }

  if (!notEmpty(fgFill) || !notEmpty(blendedBgColor)) return null;

  return buildColorsPair(selectedNode.id, fgFill, blendedBgColor);
};
