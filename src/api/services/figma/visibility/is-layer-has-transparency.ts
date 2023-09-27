import { nodeHasFills } from '~api/services/figma/nodes/node-has-fills.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getFirstVisibleNodeFill } from '~utils/figma/get-first-visible-node-fill.ts';

export const isLayerHasTransparency = (node: FigmaNode): boolean => {
  const ifTheLayerItself = node.opacity !== 1;
  const ifNoFills = !nodeHasFills(node);
  const ifActualFill = getFirstVisibleNodeFill(node.fills)?.opacity !== 1;

  return ifTheLayerItself || ifNoFills || ifActualFill;
};
