import { type FigmaPaint } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const getActualFill = (
  fills: FigmaPaint[] | readonly Paint[]
): Paint | undefined => {
  return Array.from(fills)
    .reverse()
    .find(
      (fill) =>
        fill.visible === true && notEmpty(fill.opacity) && fill.opacity > 0
    );
};
