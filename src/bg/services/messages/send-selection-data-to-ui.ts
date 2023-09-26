import {
  blendFills,
  blendLayersColors,
} from '~bg/services/figma/blend-layers-colors.ts';
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

import { calculateApcaScore } from '../apca/calculate-apca-score.ts';

interface ColorPair {
  apca: number;
  bg: FigmaPaint;
  fg: FigmaPaint;
  id: string;
}

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
  const [firstNode, secondNode] = selection;
  const firstFigmaNode = createFigmaNode(firstNode);
  const secondFigmaNode = createFigmaNode(secondNode);

  const [fg, bg] = sortNodesByLayers([firstFigmaNode, secondFigmaNode]);

  if (!notEmpty(fg) || !notEmpty(bg)) return buildEmptyPayload();

  const isFgHasTransparency = isLayerHasTransparency(fg);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendLayersColors([fg]);
  } else {
    fgFill = getActualNodeFill(fg.fills);
  }

  const bgFill = getActualNodeFill(bg.fills);

  if (!notEmpty(fgFill) || !notEmpty(bgFill)) return buildEmptyPayload();

  const nodePairPayload = buildColorsPair(fg.id, fgFill, bgFill);

  return nodePairPayload != null
    ? { selectedNodePairs: [nodePairPayload], selectedNodes: selection }
    : buildEmptyPayload();
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
  const selectedNodePairs = selection
    .map((node) => processNodeForSelection(node))
    .filter(notEmpty);

  return {
    selectedNodePairs,
    selectedNodes: selection,
  };
};

const processNodeForSelection = (node: SceneNode): ColorPair | null => {
  const figmaNode = createFigmaNode(node);
  const intersectingNodes = getIntersectingNodesWithPage(node);

  if (intersectingNodes.length === 0) return null;

  const [firstIntersectingNode] = intersectingNodes;

  if (!notEmpty(firstIntersectingNode)) return null;

  if (isLayerHasTransparency(firstIntersectingNode)) {
    return handleTransparentLayer(figmaNode, intersectingNodes);
  } else {
    return handleOpaqueLayer(figmaNode, firstIntersectingNode);
  }
};

const getIntersectingNodesWithPage = (node: SceneNode): FigmaNode[] => {
  const intersectingNodes = traverseAndCheckIntersections(
    Array.from(figma.currentPage.children),
    node
  ).map(createFigmaNode);

  return [
    ...sortNodesByLayers(intersectingNodes),
    createFigmaNode(figma.currentPage),
  ];
};

const handleTransparentLayer = (
  selectedNode: FigmaNode,
  intersectingNodes: FigmaNode[]
): ColorPair | null => {
  const blendedBgColor = blendLayersColors(intersectingNodes);

  const isFgHasTransparency = isLayerHasTransparency(selectedNode);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendFills(selectedNode.fills);
  } else {
    fgFill = getActualNodeFill(selectedNode.fills);
  }

  if (!notEmpty(fgFill) || !notEmpty(blendedBgColor)) return null;

  return buildColorsPair(selectedNode.id, fgFill, blendedBgColor);
};

const handleOpaqueLayer = (
  selectedNode: FigmaNode,
  firstIntersectingNode: FigmaNode
): ColorPair | null => {
  const bgFill = getActualNodeFill(firstIntersectingNode.fills);

  const isFgHasTransparency = isLayerHasTransparency(selectedNode);

  let fgFill;

  if (isFgHasTransparency) {
    fgFill = blendFills(selectedNode.fills);
  } else {
    fgFill = getActualNodeFill(selectedNode.fills);
  }

  if (fgFill == null || bgFill == null) return null;

  return buildColorsPair(selectedNode.id, fgFill, bgFill);
};
