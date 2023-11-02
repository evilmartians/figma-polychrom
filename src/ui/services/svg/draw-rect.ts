import { type ColorSpace } from '~types/common.ts';
import { type FigmaPaint } from '~types/figma.ts';
import { determineFillStyle } from '~ui/services/blend/determine-fill-style.ts';
import { isEmpty } from '~utils/not-empty.ts';

export interface CanvasRect {
  height: number;
  width: number;
}

export const drawRect = (
  fill: FigmaPaint,
  rectBox: CanvasRect,
  colorSpace: ColorSpace
): null | SVGGElement => {
  const svgRect = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  );

  svgRect.setAttribute('width', String(rectBox.width));
  svgRect.setAttribute('height', String(rectBox.height));

  const fillStyle = determineFillStyle(fill, colorSpace);

  if (isEmpty(fillStyle)) return null;

  // if (notEmpty(fill.blendMode)) {
  //   ctx.globalCompositeOperation = mapFigmaBlendToCanvas(fill.blendMode);
  // }

  svgRect.setAttribute('fill', fillStyle);
  svgRect.setAttribute('opacity', `${fill.opacity?.toFixed(2) ?? 1}`);

  return svgRect;
};
