import { type PolychromNode } from '~types/common.ts';

// the first node always be the selected node by the user
// because of the combination of the level and the z-index.
// In the Figma world the selected node is always on top of the other nodes
export const sortByDepthAndOrder = (
  flatNodesList: PolychromNode[]
): PolychromNode[] => {
  return flatNodesList.sort((a, b) => {
    const levelDifference = b.nestingLevel - a.nestingLevel;
    const zIndexDifference = Math.abs(b.zIndex ?? 0) - Math.abs(a.zIndex ?? 0);

    return levelDifference !== 0 ? levelDifference : zIndexDifference;
  });
};
