import { nodeHasFills } from '~api/services/figma/nodes/node-has-fills.ts';
import { type FigmaNode } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const isNodeVisible = (node: FigmaNode): boolean =>
  node.visible === true &&
  notEmpty(node.opacity) &&
  node.opacity > 0 &&
  nodeHasFills(node);
