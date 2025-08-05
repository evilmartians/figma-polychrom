import { type PolychromNode } from '~types/common.ts';
import { type FigmaColorSpace } from '~types/figma.ts';
import { mapFigmaBlendToCanvas } from '~ui/services/blend-modes/map-figma-blend-to-canvas.ts';
import {
  type CanvasRect,
  drawFillAsRect,
} from '~ui/services/svg/draw-fill-as-rect.ts';
import { isVisibleSolidFill } from '~utils/figma/is-visible-solid-fill.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';

export const drawNodesOnSvg = (
  svg: SVGSVGElement,
  pair: PolychromNode,
  foregroundBox: CanvasRect,
  backgroundBox: CanvasRect,
  colorSpace: FigmaColorSpace
): void => {
  const drawNode = (node: PolychromNode, parentGroup: SVGGElement): void => {
    const svgGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );

    svgGroup.setAttribute('id', `layer-${node.id}`);

    if (node.opacity !== 1) {
      svgGroup.setAttribute('opacity', `${node.opacity?.toFixed(2) ?? 1}`);
    }

    const mappedBlendMode = mapFigmaBlendToCanvas(node.blendMode);

    if (notEmpty(mappedBlendMode)) {
      svgGroup.setAttribute(
        'style',
        `mix-blend-mode: ${mappedBlendMode}; isolation: isolate;`
      );
    }

    const visibleFills = node.fills.filter(isVisibleSolidFill);

    visibleFills.forEach((fill) => {
      const svgRect = drawFillAsRect(
        fill,
        node.isSelected === true ? foregroundBox : backgroundBox,
        colorSpace
      );

      if (isEmpty(svgRect)) return;

      svgGroup.appendChild(svgRect);
    });

    parentGroup.appendChild(svgGroup);

    node.children.forEach((childNode) => {
      drawNode(childNode, svgGroup);
    });
  };

  drawNode(pair, svg);
};
