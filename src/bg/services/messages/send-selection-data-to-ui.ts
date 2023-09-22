import { blendLayersColors } from '~bg/services/figma/blend-layers-colors.ts';
import { isLayerHasTransparency } from '~bg/services/figma/is-layer-has-transparency.ts';
import { sortNodesByLayers } from '~bg/services/figma/sort-nodes-by-layers.ts';
import { type FigmaPaint } from '~types/figma.ts';
import {
  type MessagePayload,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';
import { hasLength, type HasLength } from '~utils/has-length.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { converter } from 'culori';
import { formatHex } from 'culori/fn';

import { calculateApcaScore } from '../apca/calculate-apca-score.ts';
import { createFigmaNode } from '../figma/create-figma-node.ts';
import { traverseAndCheckIntersections } from '../figma/traverse-and-check-intersections.ts';

interface ColorPair {
  apca: number;
  bg: FigmaPaint;
  fg: FigmaPaint;
  id: string;
}

const convertToOklch = converter('oklch');

export const sendSelectionDataToUI = (): void => {
  let currentSelection: readonly SceneNode[] = [];

  try {
    currentSelection = figma.currentPage.selection;
  } catch (error) {
    console.log(error);
  }

  const messagePayload =
    currentSelection.length === 0
      ? buildEmptyPayload()
      : hasLength(currentSelection, 2)
      ? buildPairSelectionPayload(currentSelection)
      : buildGeneralSelectionPayload(currentSelection);

  figma.ui.postMessage({
    payload: messagePayload,
    type: MessageTypes.SelectionChange,
  } satisfies MessagePayload<SelectionChangeMessage>);
};

const buildEmptyPayload = (): SelectionChangeMessage => ({
  selectedNodePairs: [],
  selectedNodes: [],
});

const buildPairSelectionPayload = (
  selection: readonly SceneNode[] & HasLength<readonly SceneNode[], 2>
): SelectionChangeMessage => {
  const [fg, bg] = selection;

  const fgFigmaNode = createFigmaNode(fg);
  const bgFigmaNode = createFigmaNode(bg);

  const fgFill = getActualNodeFill(fgFigmaNode.fills);
  const bgFill = getActualNodeFill(bgFigmaNode.fills);

  if (!notEmpty(fgFill) || !notEmpty(bgFill)) {
    return buildEmptyPayload();
  }

  const nodePairPayload = buildColorsPair(fg.id, fgFill, bgFill);

  return notEmpty(nodePairPayload)
    ? {
        selectedNodePairs: [nodePairPayload],
        selectedNodes: selection,
      }
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

  return {
    apca,
    bg: bgFill,
    fg: fgFill,
    id,
  };
};

const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const pageNode = createFigmaNode(figma.currentPage);

  const selectedNodePairs = selection
    .map((node) => {
      const intersectingNodes = traverseAndCheckIntersections(
        Array.from(figma.currentPage.children),
        node
      );
      const intersectingFigmaNodes = intersectingNodes.map(createFigmaNode);
      const sortedIntersectingNodes = sortNodesByLayers(intersectingFigmaNodes);
      const intersectingNodesWithPageNode = [
        ...sortedIntersectingNodes,
        pageNode,
      ];

      if (intersectingNodesWithPageNode.length === 0) return null;

      const [firstIntersectingNode] = intersectingNodesWithPageNode;

      if (!notEmpty(firstIntersectingNode)) return null;

      const isFirstParentTransparent = isLayerHasTransparency(
        firstIntersectingNode
      );

      if (isFirstParentTransparent) {
        const blendedBgColor = blendLayersColors(intersectingNodesWithPageNode);
        const fgFigmaNode = createFigmaNode(node);
        const actualNodeColor = getActualNodeFill(fgFigmaNode.fills);

        if (!notEmpty(actualNodeColor)) return null;

        if (notEmpty(blendedBgColor)) {
          const newSolidPaint = figma.util.solidPaint(blendedBgColor);
          const newFigmaPaint: FigmaPaint = {
            ...newSolidPaint,
            hex: formatHex({ ...newSolidPaint.color, mode: 'rgb' }),
            oklch: convertToOklch(
              { ...newSolidPaint.color, mode: 'rgb' },
              'oklch'
            ),
          };

          return buildColorsPair(node.id, actualNodeColor, newFigmaPaint);
        }

        return null;
      } else {
        const fgFigmaNode = createFigmaNode(node);

        const fgFill = getActualNodeFill(fgFigmaNode.fills);
        const bgFill = getActualNodeFill(firstIntersectingNode.fills);

        if (!notEmpty(fgFill) || !notEmpty(bgFill)) return null;

        return buildColorsPair(node.id, fgFill, bgFill);
      }
    })
    .filter(notEmpty);

  return {
    selectedNodePairs,
    selectedNodes: selection,
  };
};
