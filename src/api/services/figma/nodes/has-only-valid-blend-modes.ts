import { type PolychromNode } from '~types/common.ts';
import { type FigmaPaint } from '~types/figma.ts';
import { flattenPolychromNodesTree } from '~utils/figma/flatten-polychrom-nodes-tree.ts';
import { isVisibleSolidFill } from '~utils/figma/is-visible-solid-fill.ts';
import { isEmpty } from '~utils/not-empty.ts';

// PLUS_DARKER is LINEAR_BURN
const unprocessedBlendModes = ['LINEAR_BURN'];

const hasValidBlendMode = (fill: FigmaPaint): boolean => {
  if (isEmpty(fill.blendMode)) return true;

  return !unprocessedBlendModes.includes(fill.blendMode);
};

export const hasOnlyValidBlendModes = (nodes: PolychromNode): boolean =>
  flattenPolychromNodesTree(nodes).every(
    (node) =>
      node.fills
        .filter((fill) => isVisibleSolidFill(fill))
        .every(hasValidBlendMode) &&
      !unprocessedBlendModes.includes(node.blendMode)
  );
