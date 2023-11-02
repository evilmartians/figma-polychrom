import { type ColorSpace } from '~types/common.ts';
import { type PolychromNode } from '~types/figma.ts';
import { formatColorData } from '~ui/services/blend/format-color-data.ts';
import {
  type ColorData,
  getColorData,
} from '~ui/services/blend/get-color-data.ts';
import { isBlendedFill } from '~ui/services/blend/is-blended-fill.ts';
import { getFillFromCtx } from '~ui/services/canvas/get-fill-from-ctx.ts';
import { renderSvgOnCanvas } from '~ui/services/canvas/render-svg-on-canvas.ts';
import { findFgAndBgNodes } from '~ui/services/figma/find-fg-and-bg-nodes.ts';
import { formatPolychromNodeId } from '~ui/services/figma/format-figma-node-id.ts';
import { drawFillsOnSvg } from '~ui/services/svg/draw-fills-on-svg.ts';
import { type ContrastConclusion } from '~ui/types';
import { calculateApcaScore } from '~utils/apca/calculate-apca-score.ts';
import { getActualFill } from '~utils/figma/get-actual-fill.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { nanoid } from 'nanoid';

export interface Box {
  eyeDropperX: number;
  eyeDropperY: number;
  height: number;
  width: number;
}

const BACKGROUND_BOX = {
  eyeDropperX: 10,
  eyeDropperY: 10,
  height: 20,
  width: 20,
};

const FOREGROUND_BOX = {
  eyeDropperX: 0,
  eyeDropperY: 0,
  height: 10,
  width: 10,
};

export const CanvasColorSpace: Record<ColorSpace, 'display-p3' | 'srgb'> = {
  DISPLAY_P3: 'display-p3',
  LEGACY: 'srgb',
  SRGB: 'srgb',
};

export type ContrastConclusionList = ContrastConclusion[];

export const blendColors = async (
  pairs: PolychromNode[],
  colorSpace: ColorSpace
): Promise<ContrastConclusionList> => {
  const processedPairs = await Promise.all(
    pairs.map(async (pair) => await blendSelectionPair(pair, colorSpace))
  );

  return processedPairs.filter(notEmpty);
};

const blendSelectionPair = async (
  pair: PolychromNode,
  colorSpace: ColorSpace
): Promise<ContrastConclusion | null> => {
  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d', {
    colorSpace: CanvasColorSpace[colorSpace],
    willReadFrequently: true,
  });

  if (isEmpty(ctx)) return null;

  await drawNodesOnContext(ctx, pair, colorSpace);

  const bgColorData = extractColorData(ctx, BACKGROUND_BOX, colorSpace);
  const fgColorData = extractColorData(ctx, FOREGROUND_BOX, colorSpace);

  if (isEmpty(bgColorData) || isEmpty(fgColorData)) return null;

  const { closestBgNode, selectedNode } = findFgAndBgNodes(pair);

  if (isEmpty(selectedNode) || isEmpty(closestBgNode)) return null;

  const isFgBlended = checkIfFillBlended(selectedNode);
  const isBgBlended = checkIfFillBlended(closestBgNode);

  const apcaScore = calculateApcaScore(fgColorData, bgColorData, colorSpace);

  const nodeId = notEmpty(selectedNode.id)
    ? formatPolychromNodeId(selectedNode.id)
    : nanoid();

  ctx.canvas.remove();

  return {
    apca: apcaScore,
    bg: formatColorData(bgColorData, isBgBlended),
    fg: formatColorData(fgColorData, isFgBlended),
    id: nodeId,
  };
};

const drawNodesOnContext = async (
  ctx: CanvasRenderingContext2D,
  pair: PolychromNode,
  colorSpace: ColorSpace
): Promise<void> => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  drawFillsOnSvg(svg, pair, FOREGROUND_BOX, BACKGROUND_BOX, colorSpace);

  await renderSvgOnCanvas(ctx, svg);
};

const extractColorData = (
  ctx: CanvasRenderingContext2D,
  box: Box,
  colorSpace: ColorSpace
): ColorData | null =>
  getColorData(
    getFillFromCtx(ctx, box.eyeDropperX, box.eyeDropperY, colorSpace)
  );

const checkIfFillBlended = (node: PolychromNode): boolean => {
  const actualFill = getActualFill(node.fills);

  return isBlendedFill(node, actualFill);
};
