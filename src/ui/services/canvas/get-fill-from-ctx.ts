import { type ColorSpace } from '~types/common.ts';
import { CanvasColorSpace } from '~ui/services/blend/blend-colors.ts';

export const getFillFromCtx = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colorSpace: ColorSpace
): Uint8ClampedArray =>
  ctx.getImageData(x, y, 1, 1, { colorSpace: CanvasColorSpace[colorSpace] })
    .data;
