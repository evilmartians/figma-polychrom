import { type FigmaPaint } from '~types/figma.ts';
import { convertDecimalRGBto255Scale } from '~utils/colors/formatters';
import { calcAPCA } from 'apca-w3';

export const calculateApcaScore = (fg: FigmaPaint, bg: FigmaPaint): number => {
  const [r, g, b] = convertDecimalRGBto255Scale(fg.color);
  return Math.round(Number(calcAPCA([r, g, b, fg.opacity], bg.hex)));
};