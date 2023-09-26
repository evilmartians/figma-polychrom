import { blendFills } from '~api/services/figma/blend/blend-fills.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';

export const getNodeFill = (node: FigmaNode): FigmaPaint | null => {
  const isFgHasTransparency = isLayerHasTransparency(node);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendFills(node.fills);
  } else {
    fgFill = getActualNodeFill(node.fills);
  }

  return fgFill;
};
