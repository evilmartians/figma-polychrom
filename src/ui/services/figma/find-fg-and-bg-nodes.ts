import { type PolychromNode } from '~types/common.ts';
import { flattenPolychromNodesTree } from '~utils/figma/flatten-polychrom-nodes-tree.ts';
import { getActualNode } from '~utils/figma/get-actual-node.ts';
import { sortByDepthAndOrder } from '~utils/figma/sort-by-depth-and-order.ts';

export const findFgAndBgNodes = (
  polychromNodesTree: PolychromNode
): {
  closestBgNode?: PolychromNode;
  selectedNode?: PolychromNode;
} => {
  const flattedNodes = flattenPolychromNodesTree(polychromNodesTree);
  const sortedFlattenNodes = sortByDepthAndOrder(flattedNodes);

  const selectedNode = sortedFlattenNodes.find((node) => node.isSelected);
  const [, ...flattenWithoutSelected] = sortedFlattenNodes;

  const closestBgNode = getActualNode(flattenWithoutSelected);

  return {
    closestBgNode,
    selectedNode,
  };
};
