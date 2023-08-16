import { calcAPCA } from 'apca-w3';

import { type FigmaPaint } from '../../types/figma.ts';

const calculateRGB = (color: { b: number; g: number; r: number }): number[] =>
  Object.values(color).map((value) => Math.round(value * 255));

export const calculateApcaScore = (fg: FigmaPaint, bg: FigmaPaint): number => {
  const [r, g, b] = calculateRGB(fg.color);
  return Math.round(Number(calcAPCA([r, g, b, fg.opacity], bg.hex)));
};
