import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { type SelectedNodes } from '~types/selection.ts';
import { calculateApcaScore } from '~utils/apca/calculate-apca-score.ts';
import { convert255ScaleRGBtoDecimal } from '~utils/colors/formatters.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { converter } from 'culori';
import { formatHex, formatHex8, type Oklch } from 'culori/fn';

const convertToOklch = converter('oklch');

export const summarizeTheColors = (
  pairs: SelectedNodes[],
  colorSpace: 'DISPLAY_P3' | 'LEGACY' | 'SRGB'
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
  colorSpace: 'DISPLAY_P3' | 'LEGACY' | 'SRGB'
): {
  apca: number;
  bg: { hex: string; oklch: Oklch };
  fg: { hex: string; oklch: Oklch };
  id: string;
} | null => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (isEmpty(ctx)) return null;

  processIntersectingNodes(ctx, pair.intersectingNodes);
  processSelectedNode(ctx, pair.selectedNode);

  const fgDecimal = getColorData(getFillFromCtx(ctx, 1, 1));
  const bgDecimal = getColorData(getFillFromCtx(ctx, 0, 0));

  if (fgDecimal == null || bgDecimal == null) return null;

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
    id: pair.selectedNode.id,
  };
};

const isVisibleFill = (fill: FigmaPaint): boolean =>
  fill.visible === true && (notEmpty(fill.opacity) ? fill.opacity > 0 : true);

const drawFillsOnContext = (
  ctx: CanvasRenderingContext2D,
  fills: FigmaPaint[],
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  fills.filter(isVisibleFill).forEach((fill) => {
    drawRect(ctx, x, y, width, height, fill);
  });
};

const processIntersectingNodes = (
  ctx: CanvasRenderingContext2D,
  nodes: FigmaNode[]
): void => {
  const fillsFromIntersectingNodes = nodes
    .map((node) => node.fills)
    .reverse()
    .flat();
  drawFillsOnContext(ctx, fillsFromIntersectingNodes, 0, 0, 2, 2);
};

const processSelectedNode = (
  ctx: CanvasRenderingContext2D,
  node: FigmaNode
): void => {
  drawFillsOnContext(ctx, node.fills, 1, 1, 1, 1);
};

const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: FigmaPaint
): void => {
  ctx.fillStyle = formatHex8({
    alpha: fill.opacity,
    ...fill.color,
    mode: 'rgb',
  });

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
  y: number
): Uint8ClampedArray => ctx.getImageData(x, y, 1, 1).data;

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
