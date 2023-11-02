import { type PolychromNode } from '~types/figma.ts';

export const mapPolychromNodeTree = (
  node: PolychromNode,
  transform: (node: PolychromNode) => PolychromNode
): PolychromNode => {
  // Apply the transformation to the current node
  const newNode = transform(node);

  // Recursively map the children
  newNode.children = node.children.map((child) =>
    mapPolychromNodeTree(child, transform)
  );

  return newNode;
};
