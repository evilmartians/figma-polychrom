import { type PolychromNode } from '~types/common.ts';

export const mapPolychromNodeTree = (
  node: PolychromNode,
  transform: (node: PolychromNode) => PolychromNode
): PolychromNode => {
  const newNode = transform(node);

  newNode.children = node.children.map((child) =>
    mapPolychromNodeTree(child, transform)
  );

  return newNode;
};
