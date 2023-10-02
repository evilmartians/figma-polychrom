import { type ColorSpace } from '~types/common.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { type SelectedNodes } from '~types/selection.ts';
import { calculateApcaScore } from '~utils/apca/calculate-apca-score.ts';
import { convert255ScaleRGBtoDecimal } from '~utils/colors/formatters.ts';
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

export const renderAndBlendColors = (
  pairs: SelectedNodes[],
  colorSpace: ColorSpace
): Array<{
  apca: number;
  bg: { hex: string; oklch: Oklch };
  fg: { hex: string; oklch: Oklch };
  id: string;
}> => {
  return pairs
    .map((pair) => summarizeTheColorsForPair(pair, colorSpace))
    .filter(notEmpty);
};

const summarizeTheColorsForPair = (
  pair: SelectedNodes,
  colorSpace: ColorSpace
): {
  apca: number;
  bg: { hex: string; oklch: Oklch };
  fg: { hex: string; oklch: Oklch };
  id: string;
} | null => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    colorSpace: CanvasColorSpace[colorSpace],
  });

  if (isEmpty(ctx)) return null;

  drawNodes(ctx, pair.intersectingNodes, BACKGROUND_BOX, colorSpace);
  drawNodes(ctx, pair.selectedNode, FOREGROUND_BOX, colorSpace);

  const fgDecimal = getColorData(getFillFromCtx(ctx, 1, 1, colorSpace));
  const bgDecimal = getColorData(getFillFromCtx(ctx, 0, 0, colorSpace));

  if (isEmpty(fgDecimal) || isEmpty(bgDecimal)) return null;

  const apca = calculateApcaScore(
    {
      b: fgDecimal.b,
      g: fgDecimal.g,
      r: fgDecimal.r,
    },
    {
      b: bgDecimal.b,
      g: bgDecimal.g,
      r: bgDecimal.r,
    },
    colorSpace
  );

  canvas.remove();

  return {
    apca,
    bg: formatColorData(bgDecimal),
    fg: formatColorData(fgDecimal),
    id: nanoid(),
  };
};

const isVisibleFill = (fill: FigmaPaint): boolean =>
  fill.visible === true && (notEmpty(fill.opacity) ? fill.opacity > 0 : true);

const drawFillsOnContext = (
  ctx: CanvasRenderingContext2D,
  layers: Array<{
    fills: FigmaPaint[];
    opacity: number | undefined;
  }>,
  { height, width, x, y }: CanvasRect,
  colorSpace: ColorSpace
): void => {
  layers.forEach((layer) => {
    layer.fills.filter(isVisibleFill).forEach((fill) => {
      drawRect(ctx, x, y, width, height, fill, layer.opacity, colorSpace);
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
  opacity: number | undefined,
  colorSpace: ColorSpace
): void => {
  if (colorSpace === 'DISPLAY_P3') {
    ctx.fillStyle = `color(display-p3 ${fill.color.r} ${fill.color.g} ${
      fill.color.b
    } / ${fill.opacity ?? 1})`;
  } else {
    ctx.fillStyle = formatHex8({
      alpha: fill.opacity,
      ...fill.color,
      mode: 'rgb',
    });
  }

  ctx.globalAlpha = opacity ?? 1;

  ctx.fillRect(x, y, width, height);
};

const formatColorData = (
  color: RGB
): {
  hex: string;
  oklch: Oklch;
} => ({
  hex: formatHex({ ...color, mode: 'rgb' }),
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
