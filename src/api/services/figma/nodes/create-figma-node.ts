import { collectNodeParents } from '~api/services/figma/nodes/collect-node-parents.ts';
import { type FigmaNode } from '~types/figma.ts';
import { getNodeFills } from '~utils/get-node-fills.ts';
import { converter } from 'culori';
import { formatHex } from 'culori/fn';

const convertToOklch = converter('oklch');

export const createFigmaNode = (node: PageNode | SceneNode): FigmaNode => {
  const fills = getNodeFills(node);
  const parents = collectNodeParents(node);

  return {
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
