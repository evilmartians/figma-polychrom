import { type FigmaNode } from '~types/figma.ts';

export const getNodeFills = (
  node: FigmaNode | PageNode | SceneNode
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
