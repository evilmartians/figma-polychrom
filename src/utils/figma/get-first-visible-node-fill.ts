import { type FigmaPaint } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const getFirstVisibleNodeFill = (
  fills: FigmaPaint[]
): FigmaPaint | null => {
  const fill = Array.from(fills)
    .reverse()
    .find((fill) => fill.visible);

  return notEmpty(fill) ? fill : null;
};
