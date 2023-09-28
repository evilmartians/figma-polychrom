import { type FigmaNode } from '~types/figma.ts';
import { nodeHasFills } from '~utils/node-has-fills.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const isLayerVisible = (node: FigmaNode): boolean =>
  node.visible === true &&
  notEmpty(node.opacity) &&
  node.opacity > 0 &&
  nodeHasFills(node);
