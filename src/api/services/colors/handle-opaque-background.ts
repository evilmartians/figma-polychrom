import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { getComputedNodeFill } from '~api/services/colors/get-computed-node-fill.ts';
import { type ColorPair } from '~api/types.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getFirstVisibleNodeFill } from '~utils/figma/get-first-visible-node-fill.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const handleOpaqueBackground = (
  selectedNode: FigmaNode,
  firstIntersectingNode: FigmaNode
): ColorPair | null => {
  const bgFill = getFirstVisibleNodeFill(firstIntersectingNode.fills);

  const fgFill = getComputedNodeFill(selectedNode);

  if (notEmpty(fgFill) && notEmpty(bgFill))
    return buildColorsPair(selectedNode.id, fgFill, bgFill);

  return null;
};
