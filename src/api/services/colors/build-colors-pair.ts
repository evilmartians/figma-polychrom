import { calculateApcaScore } from '~api/services/apca/calculate-apca-score.ts';
import { type ColorPair } from '~api/types.ts';
import { type FigmaPaint } from '~types/figma.ts';

export const buildColorsPair = (
  id: string,
  fgFill: FigmaPaint,
  bgFill: FigmaPaint
): ColorPair | null => {
  const apca = calculateApcaScore(
    fgFill,
    bgFill,
    figma.root.documentColorProfile
  );

  return { apca, bg: bgFill, fg: fgFill, id };
};
