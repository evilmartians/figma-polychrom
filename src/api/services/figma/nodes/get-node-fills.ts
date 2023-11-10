import { type PolychromNode } from '~types/common.ts';

export const getNodeFills = (
  node: PageNode | PolychromNode | SceneNode
): Paint[] => {
  if ('fills' in node) {
    return typeof node.fills === 'symbol' ? [] : Array.from(node.fills);
  }

  if ('backgrounds' in node) {
    return typeof node.backgrounds === 'symbol'
      ? []
      : Array.from(node.backgrounds);
  }

  return [];
};
