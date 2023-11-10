import { type FigmaColorSpace } from '~types/figma.ts';
import { isSupportsOKLCH } from '~ui/constants.ts';
import { CanvasColorSpace } from '~ui/services/blend/blend-colors.ts';

export const getFillFromCtx = (
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  colorSpace: FigmaColorSpace
): Uint8ClampedArray => {
  return ctx.getImageData(x, y, 1, 1, {
    colorSpace: isSupportsOKLCH ? CanvasColorSpace[colorSpace] : 'srgb',
  }).data;
};
