import { calcAPCA } from 'apca-w3';

import { type FigmaPaint } from '../../../types/figma.ts';
import { calculateRGB } from '../../../utils/colors/calculate-rgb.ts';

export const calculateApcaScore = (fg: FigmaPaint, bg: FigmaPaint): number => {
  const [r, g, b] = calculateRGB(fg.color);
  return Math.round(Number(calcAPCA([r, g, b, fg.opacity], bg.hex)));
};
