import { createFigmaPaint } from '~test-utils/create-figma-paint.ts';
import { type FigmaPaint } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { blend } from 'culori';
import { type Rgb } from 'culori/fn';

export const blendFills = (fillsToBlend: FigmaPaint[]): FigmaPaint | null => {
  const [firstColor] = fillsToBlend;

  if (notEmpty(firstColor)) {
    const firstColorPrepared: Rgb = {
      ...firstColor.color,
      alpha: firstColor.opacity,
      mode: 'rgb',
    };

    const result = fillsToBlend.reduce((acc, fill) => {
      const fillColorPrepared: Rgb = {
        ...fill.color,
        alpha: fill.opacity,
        mode: 'rgb',
      };

      return blend([acc, fillColorPrepared], 'normal', 'rgb');
    }, firstColorPrepared);

    return createFigmaPaint(result);
  }

  return null;
};
