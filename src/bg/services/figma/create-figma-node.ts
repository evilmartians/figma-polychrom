import { getNodeFills } from '~bg/services/figma/get-node-fills.ts';
import { type FigmaNode } from '~types/figma.ts';
import { converter } from 'culori';
import { formatHex } from 'culori/fn';

const convertToOklch = converter('oklch');

const collectParents = (
  node: PageNode | SceneNode,
  parents: SceneNode[] = []
): SceneNode[] => {
  if (node.parent != null) {
    if (node.parent.type === 'PAGE' || node.parent.type === 'DOCUMENT')
      return parents;

    parents.push(node.parent);

    collectParents(node.parent, parents);
  }
  return parents;
};

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
    nestingLevel: collectParents(node).length,
    opacity: 'opacity' in node ? node.opacity : 1,
    parents: collectParents(node),
    visible: 'visible' in node ? node.visible : true,
    zIndex: node.parent?.children.findIndex((child) => {
      return child.id === node.id;
    }),
  };
};
