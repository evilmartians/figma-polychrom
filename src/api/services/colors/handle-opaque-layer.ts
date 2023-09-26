import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { getNodeFill } from '~api/services/colors/get-node-fill.ts';
import { type ColorPair } from '~api/types.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const handleOpaqueLayer = (
  selectedNode: FigmaNode,
  firstIntersectingNode: FigmaNode
): ColorPair | null => {
  const bgFill = getActualNodeFill(firstIntersectingNode.fills);

  const fgFill = getNodeFill(selectedNode);

  if (notEmpty(fgFill) && notEmpty(bgFill))
    return buildColorsPair(selectedNode.id, fgFill, bgFill);

  return null;
};
