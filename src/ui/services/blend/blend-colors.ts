import { type PolychromNode } from '~types/common.ts';
import { type FigmaColorSpace } from '~types/figma.ts';
import { isSupportsOKLCH } from '~ui/constants.ts';
import { formatColorData } from '~ui/services/blend/format-color-data.ts';
import { getColorData } from '~ui/services/blend/get-color-data.ts';
import { isBlendedFill } from '~ui/services/blend/is-blended-fill.ts';
import { getFillFromCtx } from '~ui/services/canvas/get-fill-from-ctx.ts';
import { renderSvgOnCanvas } from '~ui/services/canvas/render-svg-on-canvas.ts';
import { findFgAndBgNodes } from '~ui/services/figma/find-fg-and-bg-nodes.ts';
import { formatPolychromNodeId } from '~ui/services/figma/format-figma-node-id.ts';
import { drawNodesOnSvg } from '~ui/services/svg/draw-nodes-on-svg.ts';
import { type ContrastConclusion } from '~ui/types';
import { calculateApcaScore } from '~utils/apca/calculate-apca-score.ts';
import { getActualFill } from '~utils/figma/get-actual-fill.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { nanoid } from 'nanoid';

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

export const CanvasColorSpace: Record<FigmaColorSpace, 'display-p3' | 'srgb'> =
  {
    DISPLAY_P3: 'display-p3',
    LEGACY: 'srgb',
    SRGB: 'srgb',
  };

export type ContrastConclusionList = ContrastConclusion[];

export const blendColors = async (
  pairs: PolychromNode[],
  figmaColorSpace: FigmaColorSpace
): Promise<ContrastConclusionList> => {
  const processedPairs = await Promise.all(
    pairs.map(async (pair) => await blendSelectionPair(pair, figmaColorSpace))
  );

  return processedPairs.filter(notEmpty);
};

const blendSelectionPair = async (
  pair: PolychromNode,
  figmaColorSpace: FigmaColorSpace
): Promise<ContrastConclusion | null> => {
  const canvas = new OffscreenCanvas(
    BACKGROUND_BOX.width,
    BACKGROUND_BOX.height
  );

  const ctx = canvas.getContext('2d', {
    colorSpace: isSupportsOKLCH ? CanvasColorSpace[figmaColorSpace] : 'srgb',
    willReadFrequently: true,
  });

  if (isEmpty(ctx)) return null;

  await drawNodesOnContext(ctx, pair, figmaColorSpace);

  const bgColorData = getColorData(
    getFillFromCtx(
      ctx,
      BACKGROUND_BOX.eyeDropperX,
      BACKGROUND_BOX.eyeDropperY,
      figmaColorSpace
    )
  );

  const fgColorData = getColorData(
    getFillFromCtx(
      ctx,
      FOREGROUND_BOX.eyeDropperX,
      FOREGROUND_BOX.eyeDropperY,
      figmaColorSpace
    )
  );

  if (isEmpty(bgColorData) || isEmpty(fgColorData)) return null;

  const { closestBgNode, selectedNode } = findFgAndBgNodes(pair);

  if (isEmpty(selectedNode) || isEmpty(closestBgNode)) return null;

  const isFgBlended = checkIfFillBlended(selectedNode);
  const isBgBlended = checkIfFillBlended(closestBgNode);

  const apcaScore = calculateApcaScore(
    fgColorData,
    bgColorData,
    figmaColorSpace
  );

  const nodeId = notEmpty(selectedNode.id)
    ? formatPolychromNodeId(selectedNode.id)
    : nanoid();

  return {
    apca: apcaScore,
    bg: formatColorData(bgColorData, isBgBlended),
    fg: formatColorData(fgColorData, isFgBlended),
    id: nodeId,
  };
};

const drawNodesOnContext = async (
  ctx: OffscreenCanvasRenderingContext2D,
  pair: PolychromNode,
  colorSpace: FigmaColorSpace
): Promise<void> => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('width', `${BACKGROUND_BOX.width}`);
  svg.setAttribute('height', `${BACKGROUND_BOX.height}`);

  drawNodesOnSvg(svg, pair, FOREGROUND_BOX, BACKGROUND_BOX, colorSpace);

  await renderSvgOnCanvas(ctx, svg);
};

const checkIfFillBlended = (node: PolychromNode): boolean => {
  const actualFill = getActualFill(node.fills);

  return isBlendedFill(node, actualFill);
};
