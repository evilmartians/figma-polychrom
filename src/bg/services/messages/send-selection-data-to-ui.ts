import { blendLayersColors } from '~bg/services/figma/blend-layers-colors.ts';
import { createFigmaNode } from '~bg/services/figma/create-figma-node.ts';
import { isLayerHasTransparency } from '~bg/services/figma/is-layer-has-transparency.ts';
import { sortNodesByLayers } from '~bg/services/figma/sort-nodes-by-layers.ts';
import { traverseAndCheckIntersections } from '~bg/services/figma/traverse-and-check-intersections.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import {
  type MessagePayload,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';
import { hasLength, type HasLength } from '~utils/has-length.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { converter, formatHex } from 'culori';

import { calculateApcaScore } from '../apca/calculate-apca-score.ts';

interface ColorPair {
  apca: number;
  bg: FigmaPaint;
  fg: FigmaPaint;
  id: string;
}

const convertToOklch = converter('oklch');

export const sendSelectionDataToUI = (): void => {
  const currentSelection = getCurrentPageSelection();
  const messagePayload = buildMessagePayload(currentSelection);

  figma.ui.postMessage({
    payload: messagePayload,
    type: MessageTypes.SelectionChange,
  } satisfies MessagePayload<SelectionChangeMessage>);
};

const getCurrentPageSelection = (): readonly SceneNode[] => {
  try {
    return figma.currentPage.selection;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const buildMessagePayload = (
  currentSelection: readonly SceneNode[]
): SelectionChangeMessage => {
  if (currentSelection.length === 0) return buildEmptyPayload();

  if (hasLength(currentSelection, 2))
    return buildPairSelectionPayload(currentSelection);

  return buildGeneralSelectionPayload(currentSelection);
};

const buildEmptyPayload = (): SelectionChangeMessage => ({
  selectedNodePairs: [],
  selectedNodes: [],
});

const buildPairSelectionPayload = (
  selection: readonly SceneNode[] & HasLength<readonly SceneNode[], 2>
): SelectionChangeMessage => {
  const [fg, bg] = selection;
  const fgFill = getFillForNode(fg);
  const bgFill = getFillForNode(bg);

  if (!notEmpty(fgFill) || !notEmpty(bgFill)) return buildEmptyPayload();

  const nodePairPayload = buildColorsPair(fg.id, fgFill, bgFill);

  return nodePairPayload != null
    ? { selectedNodePairs: [nodePairPayload], selectedNodes: selection }
    : buildEmptyPayload();
};

const getFillForNode = (node: SceneNode): FigmaPaint | undefined => {
  const figmaNode = createFigmaNode(node);

  return getActualNodeFill(figmaNode.fills);
};

const buildColorsPair = (
  id: string,
  fgFill: FigmaPaint,
  bgFill: FigmaPaint
): ColorPair | null => {
  const apca = calculateApcaScore(
    fgFill,
    bgFill,
    figma.root.documentColorProfile
  );

  return { apca, bg: bgFill, fg: fgFill, id };
};

const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const pageNode = createFigmaNode(figma.currentPage);

  const selectedNodePairs = selection
    .map((node) => processNodeForSelection(node, pageNode))
    .filter(notEmpty);

  return {
    selectedNodePairs,
    selectedNodes: selection,
  };
};

const processNodeForSelection = (
  node: SceneNode,
  pageNode: FigmaNode
): ColorPair | null => {
  const intersectingNodes = getIntersectingNodesWithPage(node, pageNode);

  if (intersectingNodes.length === 0) return null;

  const [firstIntersectingNode] = intersectingNodes;

  if (!notEmpty(firstIntersectingNode)) return null;

  if (isLayerHasTransparency(firstIntersectingNode)) {
    return handleTransparentLayer(node, intersectingNodes);
  } else {
    return handleOpaqueLayer(node, firstIntersectingNode);
  }
};

const getIntersectingNodesWithPage = (
  node: SceneNode,
  pageNode: FigmaNode
): FigmaNode[] => {
  const intersectingNodes = traverseAndCheckIntersections(
    Array.from(figma.currentPage.children),
    node
  ).map(createFigmaNode);

  return [...sortNodesByLayers(intersectingNodes), pageNode];
};

const handleTransparentLayer = (
  node: SceneNode,
  intersectingNodes: FigmaNode[]
): ColorPair | null => {
  const blendedBgColor = blendLayersColors(intersectingNodes);
  const actualNodeColor = getActualNodeFillFromNode(node);

  if (!notEmpty(actualNodeColor) || !notEmpty(blendedBgColor)) return null;

  const newFigmaPaint: FigmaPaint = createNewFigmaPaint(blendedBgColor);

  return buildColorsPair(node.id, actualNodeColor, newFigmaPaint);
};

const handleOpaqueLayer = (
  node: SceneNode,
  firstIntersectingNode: FigmaNode
): ColorPair | null => {
  const fgFill = getActualNodeFillFromNode(node);
  const bgFill = getActualNodeFill(firstIntersectingNode.fills);

  if (fgFill == null || bgFill == null) return null;

  return buildColorsPair(node.id, fgFill, bgFill);
};

const getActualNodeFillFromNode = (node: SceneNode): FigmaPaint | undefined => {
  const figmaNode = createFigmaNode(node);

  return getActualNodeFill(figmaNode.fills);
};

const createNewFigmaPaint = (blendedBgColor: string): FigmaPaint => {
  const newSolidPaint = figma.util.solidPaint(blendedBgColor);

  return {
    ...newSolidPaint,
    hex: formatHex({ ...newSolidPaint.color, mode: 'rgb' }),
    oklch: convertToOklch({ ...newSolidPaint.color, mode: 'rgb' }, 'oklch'),
  };
};
