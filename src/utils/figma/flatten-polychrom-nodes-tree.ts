import { type PolychromNode } from '~types/figma.ts';

export const flattenPolychromNodesTree = (
  nodesTree: PolychromNode,
  parentNestingLevel = 0
): PolychromNode[] => {
  let flatNodes: PolychromNode[] = [nodesTree];

  nodesTree.children.forEach((node) => {
    // Update the nesting level based on the parent
    const updatedNode = { ...node, nestingLevel: parentNestingLevel + 1 };

    flatNodes.push(updatedNode);

    if (node.children.length > 0) {
      flatNodes = flatNodes.concat(
        flattenPolychromNodesTree(node, updatedNode.nestingLevel)
      );
    }
  });

  return flatNodes;
};
