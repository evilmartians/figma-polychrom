import { type ColorSpace } from '~types/common.ts';
import { type PolychromNode } from '~types/figma.ts';
import { type CanvasRect, drawRect } from '~ui/services/svg/draw-rect.ts';
import { isVisibleSolidFill } from '~ui/services/svg/is-visible-solid-fill.ts';
import { isEmpty } from '~utils/not-empty.ts';

export const drawFillsOnSvg = (
  svg: SVGSVGElement,
  pair: PolychromNode,
  foregroundBox: CanvasRect,
  backgroundBox: CanvasRect,
  colorSpace: ColorSpace
): void => {
  const drawNode = (node: PolychromNode, parentGroup: SVGGElement): void => {
    const svgGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );

    svgGroup.setAttribute('id', `layer-${node.id}`);
    svgGroup.setAttribute('opacity', `${node.opacity?.toFixed(2) ?? 1}`);

    if (node.isSelected === true) {
      svgGroup.setAttribute('class', 'selected-polychrom');
    }

    const visibleFills = node.fills.filter(isVisibleSolidFill);

    visibleFills.forEach((fill) => {
      const svgRect = drawRect(
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
