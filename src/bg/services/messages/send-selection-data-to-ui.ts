import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import {
  type MessagePayload,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';
import { notEmpty } from '~utils/not-empty.ts';

import { calculateApcaScore } from '../apca/calculate-apca-score.ts';
import { createFigmaNode } from '../figma/create-figma-node.ts';
import { findClosestIntersectingNode } from '../figma/find-closest-intersecting-node.ts';

interface NodePair {
  apca: number;
  bgNode: FigmaNode;
  selectedNode: FigmaNode;
}

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
      : currentSelection.length === 2
      ? buildPairSelectionPayload(Array.from(currentSelection))
      : buildMultipleSelectionPayload(Array.from(currentSelection));

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
  selection: SceneNode[]
): SelectionChangeMessage => {
  const nodePairPayload = buildNodePairPayload(selection[1], selection[0]);

  return nodePairPayload != null
    ? {
        selectedNodePairs: [nodePairPayload],
        selectedNodes: selection,
      }
    : buildEmptyPayload();
};

const buildNodePairPayload = (
  fgNode: SceneNode,
  bgNode: PageNode | SceneNode
): NodePair | null => {
  const fgFigmaNode = createFigmaNode(fgNode);
  const bgFigmaNode = createFigmaNode(bgNode);

  if (
    !isFillVisible(fgFigmaNode.fills[0]) ||
    !isFillVisible(bgFigmaNode.fills[0])
  )
    return null;

  return {
    apca: calculateApcaScore(fgFigmaNode.fills[0], bgFigmaNode.fills[0]),
    bgNode: bgFigmaNode,
    selectedNode: fgFigmaNode,
  };
};

const isFillVisible = (fill: FigmaPaint): boolean => Boolean(fill?.visible);

const buildMultipleSelectionPayload = (
  selection: SceneNode[]
): SelectionChangeMessage => {
  const selectedNodePairs = selection
    .reverse()
    .map((node) => {
      const bgNode = findClosestIntersectingNode(node);

      if (notEmpty(bgNode)) return buildNodePairPayload(node, bgNode);

      return null;
    })
    .filter(notEmpty);

  return {
    selectedNodePairs,
    selectedNodes: selection,
  };
};
