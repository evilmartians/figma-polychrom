import { type PolychromNode } from '~types/common.ts';
import { type FigmaPaint } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const isBlendedFill = (
  node?: PolychromNode,
  fill?: FigmaPaint
): boolean => {
  return (
    (notEmpty(node) && node.opacity !== 1) ||
    (notEmpty(fill) && fill.opacity !== 1)
  );
};
