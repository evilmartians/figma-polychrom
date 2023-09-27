import { blendFills } from '~api/services/figma/blend/blend-fills.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { getFirstVisibleNodeFill } from '~utils/figma/get-first-visible-node-fill.ts';

export const getComputedNodeFill = (node: FigmaNode): FigmaPaint | null => {
  const isFgHasTransparency = isLayerHasTransparency(node);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendFills(node.fills);
  } else {
    fgFill = getFirstVisibleNodeFill(node.fills);
  }

  return fgFill;
};
