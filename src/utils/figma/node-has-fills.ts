import { getNodeFills } from './get-node-fills.ts';

export const nodeHasFills = (node: SceneNode): boolean =>
  getNodeFills(node).some((fill) => fill.type === 'SOLID');
