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
  height: 20,
  width: 20,
  x: 0,
  y: 0,
};

const FOREGROUND_BOX = {
  height: 10,
  width: 10,
  x: 0,
  y: 10,
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

interface Layer {
  // blendMode?: BlendMode;
  fills: FigmaPaint[];
  opacity?: number;
}

// remove any non-alphabetical or non-numeric characters
const formatFigmaNodeID = (id: string): string => id.replace(/[^a-z0-9]/gi, '');

const isBlended = (node?: FigmaNode, fill?: FigmaPaint): boolean => {
  return (
    (node != null && node.opacity !== 1) || (fill != null && fill.opacity !== 1)
  );
};

const isVisibleSolidFill = (fill: FigmaPaint): boolean =>
  fill.visible === true &&
  (notEmpty(fill.opacity) ? fill.opacity > 0 : true) &&
  fill.type === 'SOLID';

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
    willReadFrequently: true,
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

  const { fill: fgFill, node: fgNode } = getNodeAndFill(
    pair.selectedNodeWithIntersectingNodes
  );
  const { fill: bgFill, node: bgNode } = getNodeAndFill(pair.intersectingNodes);

  const isFgBlended = isBlended(fgNode, fgFill);
  const isBgBlended = isBlended(bgNode, bgFill);

  const apca = calculateApcaScore(fgColorData, bgColorData, colorSpace);
  const nodeId = pair.selectedNodeWithIntersectingNodes[0]?.id;
  const id = notEmpty(nodeId) ? formatFigmaNodeID(nodeId) : nanoid();

  canvas.remove();

  return createContrastConclusion(
    id,
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

  drawNodes(
    ctx,
    pair.selectedNodeWithIntersectingNodes,
    FOREGROUND_BOX,
    colorSpace
  );
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

const createContrastConclusion = (
  id: string,
  apcaScore: number,
  fgColor: RGB,
  isFgBlended: boolean,
  bgColor: RGB,
  isBgBlended: boolean
): ContrastConclusion => ({
  apca: apcaScore,
  bg: formatColorData(bgColor, isBgBlended),
  fg: formatColorData(fgColor, isFgBlended),
  id,
});

const drawResultFill = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  tempColorData: {
    alpha: number;
    b: number;
    g: number;
    r: number;
  } | null,
  layer: Layer,
  colorSpace: ColorSpace
): void => {
  const resultFill: FigmaPaint = {
    // blendMode: layer.blendMode,
    color: {
      b: tempColorData?.b ?? 0,
      g: tempColorData?.g ?? 0,
      r: tempColorData?.r ?? 0,
    },
    opacity: (layer.opacity ?? 1) * (tempColorData?.alpha ?? 1),
    // opacity: tempColorData?.alpha ?? 1,
    type: 'SOLID',
  };

  drawRect(ctx, x, y, width, height, resultFill, colorSpace);
};

const drawFillsOnContext = (
  ctx: CanvasRenderingContext2D,
  layers: Layer[],
  { height, width, x, y }: CanvasRect,
  colorSpace: ColorSpace
): void => {
  const tempY = y + height * 2;

  layers.forEach((layer, index) => {
    const tempX = x + width * index;

    const visibleFills = layer.fills.filter(isVisibleSolidFill);

    visibleFills.forEach((fill) => {
      drawRect(ctx, tempX, tempY, width, height, fill, colorSpace);
    });

    // Retrieve color data of the filled region.
    const tempColorData = getColorData(
      getFillFromCtx(ctx, tempX, tempY, colorSpace)
    );

    // Draw the resulting fill on the main drawing area using the retrieved color data.
    drawResultFill(ctx, x, y, width, height, tempColorData, layer, colorSpace);
  });
};

const drawNodes = (
  ctx: CanvasRenderingContext2D,
  nodes: FigmaNode[],
  { height, width, x, y }: CanvasRect,
  colorSpace: ColorSpace
): void => {
  const formattedIntersectingNodes = nodes
    .map((node) => ({
      // blendMode: node.blendMode,
      fills: node.fills,
      opacity: node.opacity,
    }))
    .reverse()
    .flat();

  drawFillsOnContext(
    ctx,
    formattedIntersectingNodes,
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
  colorSpace: ColorSpace
): void => {
  const fillStyle = determineFillStyle(fill, colorSpace);

  if (isEmpty(fillStyle)) return;

  ctx.fillStyle = fillStyle;

  // if (notEmpty(fill.blendMode)) {
  //   ctx.globalCompositeOperation = mapFigmaBlendToCanvas(fill.blendMode);
  // }

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

    if (fill.opacity === 1) {
      return formatHex({ b, g, mode: 'rgb', r });
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
  alpha: number;
  b: number;
  g: number;
  r: number;
} | null => {
  const [r, g, b, alpha] = fill;

  if (isEmpty(r) || isEmpty(g) || isEmpty(b)) return null;

  return convert255ScaleRGBtoDecimal({ alpha, b, g, r });
};

export const mapFigmaBlendToCanvas = (
  figmaBlend: BlendMode
): GlobalCompositeOperation => {
  const mapping: Record<BlendMode, GlobalCompositeOperation> = {
    COLOR: 'color',
    COLOR_BURN: 'color-burn',
    COLOR_DODGE: 'color-dodge',
    DARKEN: 'darken',
    DIFFERENCE: 'difference',
    EXCLUSION: 'exclusion',
    HARD_LIGHT: 'hard-light',
    HUE: 'hue',
    LIGHTEN: 'lighten',
    // unsupported
    LINEAR_BURN: 'color-burn',
    // unsupported
    LINEAR_DODGE: 'lighter',
    LUMINOSITY: 'luminosity',
    MULTIPLY: 'multiply',
    NORMAL: 'source-over',
    OVERLAY: 'overlay',
    // only for layers, not for fills
    PASS_THROUGH: 'source-over',
    SATURATION: 'saturation',
    SCREEN: 'screen',
    SOFT_LIGHT: 'soft-light',
  };

  return mapping[figmaBlend];
};
