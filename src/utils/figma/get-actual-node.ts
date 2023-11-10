import { type PolychromNode } from '~types/common.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const getActualNode = (
  nodes: PolychromNode[]
): PolychromNode | undefined => {
  return nodes.find(
    (node) =>
      node.visible === true &&
      notEmpty(node.opacity) &&
      node.opacity > 0 &&
      node.fills.length > 0 &&
      node.fills.some(
        (fill) =>
          fill.visible === true && notEmpty(fill.opacity) && fill.opacity > 0
      )
  );
};
