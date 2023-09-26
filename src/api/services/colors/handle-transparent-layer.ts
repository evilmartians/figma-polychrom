import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { getNodeFill } from '~api/services/colors/get-node-fill.ts';
import { blendLayersColors } from '~api/services/figma/blend/blend-layers-colors.ts';
import { type ColorPair } from '~api/types.ts';
import { type FigmaNode } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const handleTransparentLayer = (
  selectedNode: FigmaNode,
  intersectingNodes: FigmaNode[]
): ColorPair | null => {
  const blendedBgColor = blendLayersColors(intersectingNodes);

  const fgFill = getNodeFill(selectedNode);

  if (notEmpty(fgFill) && notEmpty(blendedBgColor))
    buildColorsPair(selectedNode.id, fgFill, blendedBgColor);

  return null;
};
