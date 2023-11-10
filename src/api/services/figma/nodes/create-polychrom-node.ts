import { collectNodeParents } from '~api/services/figma/nodes/collect-node-parents.ts';
import { getNodeFills } from '~api/services/figma/nodes/get-node-fills.ts';
import { type PolychromNode } from '~types/common.ts';
import { converter } from 'culori';
import { formatHex } from 'culori/fn';

const convertToOklch = converter('oklch');

export const createPolychromNode = (
  node: PageNode | SceneNode,
  selectedNodeId?: string
): PolychromNode => {
  const fills = getNodeFills(node);
  const parents = collectNodeParents(node);

  return {
    blendMode: 'blendMode' in node ? node.blendMode : 'PASS_THROUGH',
    children: [],
    fills: fills.map((fill) => {
      if (fill.type === 'SOLID') {
        return {
          ...fill,
          hex: formatHex({ ...fill.color, mode: 'rgb' }),
          oklch: convertToOklch({ ...fill.color, mode: 'rgb' }, 'oklch'),
        };
      } else {
        return fill;
      }
    }),
    id: node.id,
    isSelected: node.id === selectedNodeId,
    name: node.name,
    nestingLevel: parents.length,
    opacity: 'opacity' in node ? node.opacity : 1,
    parents,
    visible: 'visible' in node ? node.visible : true,
    zIndex: node.parent?.children.findIndex((child) => {
      return child.id === node.id;
    }),
  };
};
