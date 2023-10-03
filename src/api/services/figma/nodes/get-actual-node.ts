import { type FigmaNode } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const getActualNode = (nodes: FigmaNode[]): FigmaNode | undefined => {
  return nodes.find(
    (node) =>
      node.visible === true &&
      notEmpty(node.opacity) &&
      node.opacity > 0 &&
      node.fills.length > 0
  );
};
