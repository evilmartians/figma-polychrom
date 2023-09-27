import { calculateApcaScore } from '~api/services/apca/calculate-apca-score.ts';
import { type FigmaPaint } from '~types/figma.ts';
import { type SelectedNodes } from '~types/selection.ts';

export const buildColorsPair = (
  id: string,
  fgFill: FigmaPaint,
  bgFill: FigmaPaint
): null | SelectedNodes => {
  const apca = calculateApcaScore(
    fgFill,
    bgFill,
    figma.root.documentColorProfile
  );

  return { apca, bg: bgFill, fg: fgFill, id };
};
