import { type FigmaNode } from '~types/figma.ts';

import { getNodeFills } from './get-node-fills.ts';

export const nodeHasFills = (node: FigmaNode): boolean =>
  getNodeFills(node).some((fill) => fill.visible);
