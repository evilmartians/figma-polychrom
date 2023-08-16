import { formatHex, oklch } from 'culori';

import { type FigmaNode } from '../../types/figma.ts';
import { getNodeFills } from './get-node-fills';

export const createFigmaNode = (node: SceneNode): FigmaNode => {
  const fills = getNodeFills(node);
  const solidFills = fills.filter(
    (fill): fill is SolidPaint => fill.type === 'SOLID'
  );

  return {
    fills: solidFills.map((fill) => ({
      ...fill,
      hex: formatHex({ ...fill.color, mode: 'rgb' }),
      oklch: oklch({ ...fill.color, mode: 'rgb' }, 'oklch'),
    })),
    id: node.id,
  };
};
