import { type ColorSpace } from '~types/common.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { type SelectedNodes } from '~types/selection.ts';
import { calculateApcaScore } from '~utils/apca/calculate-apca-score.ts';
import { convert255ScaleRGBtoDecimal } from '~utils/colors/formatters.ts';
import { getActualNodeFill } from '~utils/get-actual-node-fill.ts';
import { getActualNode } from '~utils/get-actual-node.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { converter, formatHex8 } from 'culori';
import { formatHex, type Oklch } from 'culori/fn';
import { nanoid } from 'nanoid';

const convertToOklch = converter('oklch');

interface CanvasRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

const BACKGROUND_BOX = {
  height: 2,
  width: 2,
  x: 0,
  y: 0,
};

const FOREGROUND_BOX = {
  height: 1,
  width: 1,
  x: 1,
  y: 1,
};

const CanvasColorSpace: Record<ColorSpace, 'display-p3' | 'srgb'> = {
  DISPLAY_P3: 'display-p3',
  LEGACY: 'srgb',
  SRGB: 'srgb',
};

export interface ContrastConclusion {
  apca: number;
  bg: { hex: string; isBlended: boolean; oklch: Oklch };
  fg: { hex: string; isBlended: boolean; oklch: Oklch };
  id: string;
}

export type ContrastConclusionList = ContrastConclusion[];

export const renderAndBlendColors = (
  pairs: SelectedNodes[],
  colorSpace: ColorSpace
): ContrastConclusionList => {
  return pairs
    .map((pair) => summarizeTheColorsForPair(pair, colorSpace))
    .filter(notEmpty);
};

const summarizeTheColorsForPair = (
  pair: SelectedNodes,
  colorSpace: ColorSpace
): ContrastConclusion | null => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    colorSpace: CanvasColorSpace[colorSpace],
  });

  if (isEmpty(ctx)) return null;

  renderNodesOnCanvas(ctx, pair, colorSpace);

  const fgColorData = getColorData(
    getFillFromCtx(ctx, FOREGROUND_BOX.x, FOREGROUND_BOX.y, colorSpace)
  );
  const bgColorData = getColorData(
    getFillFromCtx(ctx, BACKGROUND_BOX.x, BACKGROUND_BOX.y, colorSpace)
  );

  if (isEmpty(fgColorData) || isEmpty(bgColorData)) return null;

  const { fill: fgFill, node: fgNode } = getNodeAndFill(pair.selectedNode);
  const { fill: bgFill, node: bgNode } = getNodeAndFill(pair.intersectingNodes);

  const isFgBlended = isBlended(fgNode, fgFill);
  const isBgBlended = isBlended(bgNode, bgFill);

  const apca = calculateApcaScore(fgColorData, bgColorData, colorSpace);

  canvas.remove();

  return createContrastConclusion(
    apca,
    fgColorData,
    isFgBlended,
    bgColorData,
    isBgBlended
  );
};

const renderNodesOnCanvas = (
  ctx: CanvasRenderingContext2D,
  pair: SelectedNodes,
  colorSpace: ColorSpace
): void => {
  drawNodes(ctx, pair.intersectingNodes, BACKGROUND_BOX, colorSpace);
  drawNodes(ctx, pair.selectedNode, FOREGROUND_BOX, colorSpace);
};

const getNodeAndFill = (
  nodes: FigmaNode[]
): {
  fill?: FigmaPaint;
  node?: FigmaNode;
} => {
  const actualNode = getActualNode(nodes);

  return {
    fill: actualNode != null ? getActualNodeFill(actualNode.fills) : undefined,
    node: actualNode,
  };
};

const isBlended = (node?: FigmaNode, fill?: FigmaPaint): boolean => {
  return (
    (node != null && node.opacity !== 1) || (fill != null && fill.opacity !== 1)
  );
};

const createContrastConclusion = (
  apcaScore: number,
  fgColor: RGB,
  isFgBlended: boolean,
  bgColor: RGB,
  isBgBlended: boolean
): ContrastConclusion => ({
  apca: apcaScore,
  bg: formatColorData(bgColor, isBgBlended),
  fg: formatColorData(fgColor, isFgBlended),
  id: nanoid(),
});

const isVisibleSolidFill = (fill: FigmaPaint): boolean =>
  fill.visible === true &&
  (notEmpty(fill.opacity) ? fill.opacity > 0 : true) &&
  fill.type === 'SOLID';

const drawFillsOnContext = (
  ctx: CanvasRenderingContext2D,
  layers: Array<{
    fills: FigmaPaint[];
    opacity?: number;
  }>,
  { height, width, x, y }: CanvasRect,
  colorSpace: ColorSpace
): void => {
  layers.forEach((layer) => {
    layer.fills.filter(isVisibleSolidFill).forEach((fill) => {
      drawRect(ctx, x, y, width, height, fill, colorSpace, layer.opacity);
    });
  });
};

const drawNodes = (
  ctx: CanvasRenderingContext2D,
  nodes: FigmaNode[],
  { height, width, x, y }: CanvasRect,
  colorSpace: ColorSpace
): void => {
  const fillsFromIntersectingNodes = nodes
    .map((node) => ({
      fills: node.fills,
      opacity: node.opacity,
    }))
    .reverse()
    .flat();

  drawFillsOnContext(
    ctx,
    fillsFromIntersectingNodes,
    { height, width, x, y },
    colorSpace
  );
};

const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: FigmaPaint,
  colorSpace: ColorSpace,
  opacity?: number
): void => {
  const fillStyle = determineFillStyle(fill, colorSpace);
  if (isEmpty(fillStyle)) return;

  ctx.fillStyle = fillStyle;
  ctx.globalAlpha = opacity ?? 1;

  ctx.fillRect(x, y, width, height);
};

const determineFillStyle = (
  fill: FigmaPaint,
  colorSpace: ColorSpace
): string | undefined => {
  if (fill.type === 'SOLID') {
    const { b, g, r } = fill.color;

    if (colorSpace === 'DISPLAY_P3') {
      return `color(display-p3 ${r} ${g} ${b} / ${fill.opacity ?? 1})`;
    }

    return formatHex8({
      alpha: fill.opacity,
      b,
      g,
      mode: 'rgb',
      r,
    });
  }
};

const formatColorData = (
  color: RGB,
  isBlended: boolean
): {
  hex: string;
  isBlended: boolean;
  oklch: Oklch;
} => ({
  hex: formatHex({ ...color, mode: 'rgb' }),
  isBlended,
  oklch: convertToOklch({ ...color, mode: 'rgb' }, 'oklch'),
});

const getFillFromCtx = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colorSpace: ColorSpace
): Uint8ClampedArray =>
  ctx.getImageData(x, y, 1, 1, { colorSpace: CanvasColorSpace[colorSpace] })
    .data;

const getColorData = (
  fill: Uint8ClampedArray
): {
  b: number;
  g: number;
  r: number;
} | null => {
  const [r, g, b] = fill;

  if (isEmpty(r) || isEmpty(g) || isEmpty(b)) return null;

  return convert255ScaleRGBtoDecimal({ b, g, r });
};
