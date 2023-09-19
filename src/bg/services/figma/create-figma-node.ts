import { getNodeFills } from '~bg/services/figma/get-node-fills.ts';
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
  };
};
