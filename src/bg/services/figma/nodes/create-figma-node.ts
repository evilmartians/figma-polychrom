import { collectNodeParents } from '~bg/services/figma/nodes/collect-node-parents.ts';
import { getNodeFills } from '~bg/services/figma/nodes/get-node-fills.ts';
import { type FigmaNode } from '~types/figma.ts';
import { converter } from 'culori';
import { formatHex } from 'culori/fn';

const convertToOklch = converter('oklch');

export const createFigmaNode = (node: PageNode | SceneNode): FigmaNode => {
  const fills = getNodeFills(node);
  const solidFills = fills.filter(
    (fill): fill is SolidPaint => fill.type === 'SOLID'
  );

  return {
    fills: solidFills.map((fill) => {
      return {
        ...fill,
        hex: formatHex({ ...fill.color, mode: 'rgb' }),
        oklch: convertToOklch({ ...fill.color, mode: 'rgb' }, 'oklch'),
      };
    }),
    id: node.id,
    name: node.name,
    nestingLevel: collectNodeParents(node).length,
    opacity: 'opacity' in node ? node.opacity : 1,
    parents: collectNodeParents(node),
    visible: 'visible' in node ? node.visible : true,
    zIndex: node.parent?.children.findIndex((child) => {
      return child.id === node.id;
    }),
  };
};
