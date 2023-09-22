import { type FigmaNode } from '~types/figma.ts';

export const sortNodesByLayers = (nodes: FigmaNode[]): FigmaNode[] =>
  nodes.sort((a, b) => {
    const levelDifference = b.nestingLevel - a.nestingLevel;
    const zIndexDifference = Math.abs(b.zIndex ?? 0) - Math.abs(a.zIndex ?? 0);

    return levelDifference !== 0 ? levelDifference : zIndexDifference;
  });
