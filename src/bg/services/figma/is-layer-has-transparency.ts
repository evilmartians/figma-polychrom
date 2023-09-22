import { nodeHasFills } from '~bg/services/figma/node-has-fills.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';

export const isLayerHasTransparency = (node: FigmaNode): boolean => {
  const ifTheLayerItself = node.opacity !== 1;
  const ifNoFills = !nodeHasFills(node);
  const ifActualFill = getActualNodeFill(node.fills)?.opacity !== 1;

  return ifTheLayerItself || ifNoFills || ifActualFill;
};

export const isLayerInvisible = (node: FigmaNode): boolean => {
  const ifTheLayerItself = node.visible === false;

  const ifAllFillsInvisible = node.fills.every(
    (fill) => fill.visible === false
  );

  const ifAllFillsTransparent = node.fills.every((fill) => fill.opacity === 0);

  return ifTheLayerItself || ifAllFillsInvisible || ifAllFillsTransparent;
};
