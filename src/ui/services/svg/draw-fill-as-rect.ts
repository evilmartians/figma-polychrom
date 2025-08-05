import { type FigmaColorSpace, type FigmaPaint } from '~types/figma.ts';
import { mapFigmaBlendToCanvas } from '~ui/services/blend-modes/map-figma-blend-to-canvas.ts';
import { determineFillStyle } from '~ui/services/blend/determine-fill-style.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';

export interface CanvasRect {
  height: number;
  width: number;
}

export const drawFillAsRect = (
  fill: FigmaPaint,
  rectBox: CanvasRect,
  colorSpace: FigmaColorSpace
): null | SVGGElement => {
  const svgRect = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  );

  svgRect.setAttribute('width', String(rectBox.width));
  svgRect.setAttribute('height', String(rectBox.height));

  if (notEmpty(fill.blendMode)) {
    const mappedBlendMode = mapFigmaBlendToCanvas(fill.blendMode);

    if (notEmpty(mappedBlendMode)) {
      svgRect.setAttribute('style', `mix-blend-mode: ${mappedBlendMode};`);
    }
  }

  const fillStyle = determineFillStyle(fill, colorSpace);

  if (isEmpty(fillStyle)) return null;

  svgRect.setAttribute('fill', fillStyle);

  if (fill.opacity !== 1) {
    svgRect.setAttribute('opacity', `${fill.opacity?.toFixed(2) ?? 1}`);
  }

  return svgRect;
};
