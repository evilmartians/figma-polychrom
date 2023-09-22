import { type FigmaNode } from '~types/figma.ts';

export const isLayerInvisible = (node: FigmaNode): boolean => {
  const ifTheLayerItself = node.visible === false;

  const ifAllFillsInvisible = node.fills.every(
    (fill) => fill.visible === false
  );

  const ifAllFillsTransparent = node.fills.every((fill) => fill.opacity === 0);

  return ifTheLayerItself || ifAllFillsInvisible || ifAllFillsTransparent;
};
