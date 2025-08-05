import { type PolychromNode } from '~types/common.ts';
import { flattenPolychromNodesTree } from '~utils/figma/flatten-polychrom-nodes-tree.ts';
import { getActualFill } from '~utils/figma/get-actual-fill.ts';
import { getActualNode } from '~utils/figma/get-actual-node.ts';
import { sortByDepthAndOrder } from '~utils/figma/sort-by-depth-and-order.ts';
import { isEmpty } from '~utils/not-empty.ts';

// TODO: Improve if there are any non solid visible fills with opacity.

export const isValidForBackground = (nodesTree: PolychromNode): boolean => {
  const flattenNodesList = flattenPolychromNodesTree(nodesTree);

  const sortedFlattenNodesList = sortByDepthAndOrder(flattenNodesList);

  const sortedFlattenNodesWithoutSelected = sortedFlattenNodesList.filter(
    (node) => node.isSelected === false
  );

  const actualNode = getActualNode(sortedFlattenNodesWithoutSelected);

  if (isEmpty(actualNode)) return false;

  const actualFill = getActualFill(actualNode?.fills);

  if (isEmpty(actualFill)) return false;

  return actualFill.type === 'SOLID';
};
