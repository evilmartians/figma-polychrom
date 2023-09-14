import { type FigmaPaint } from '~types/figma.ts';

export const getActualNodeFill = (
  fills: FigmaPaint[]
): FigmaPaint | undefined => {
  return Array.from(fills)
    .reverse()
    .find((fill) => fill.visible);
};
