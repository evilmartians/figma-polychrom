import { type FigmaNode } from '~types/figma.ts';
import {
  type MessagePayload,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';
import { hasLength, type HasLength } from '~utils/has-length.ts';
import { notEmpty } from '~utils/not-empty.ts';

import { calculateApcaScore } from '../apca/calculate-apca-score.ts';
import { createFigmaNode } from '../figma/create-figma-node.ts';
import { findClosestProperNode } from '../figma/find-closest-proper-node.ts';

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

  const nodePairPayload = buildNodePair(fg, bg);

  return nodePairPayload != null
    ? {
        selectedNodePairs: [nodePairPayload],
        selectedNodes: selection,
      }
    : buildEmptyPayload();
};

const buildNodePair = (
  fgNode: SceneNode,
  bgNode: PageNode | SceneNode
): NodePair | null => {
  const fgFigmaNode = createFigmaNode(fgNode);
  const bgFigmaNode = createFigmaNode(bgNode);

  const fgFill = getActualNodeFill(fgFigmaNode.fills);
  const bgFill = getActualNodeFill(bgFigmaNode.fills);

  if (fgFill == null || bgFill == null) return null;

  const apca = calculateApcaScore(
    fgFill,
    bgFill,
    figma.root.documentColorProfile
  );

  if (apca == null) return null;

  return {
    apca,
    bgNode: bgFigmaNode,
    selectedNode: fgFigmaNode,
  };
};

const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const selectedNodePairs = selection
    .map((node) => {
      const bgNode = findClosestProperNode(node);

      if (notEmpty(bgNode)) return buildNodePair(node, bgNode);

      return null;
    })
    .filter(notEmpty);

  return {
    selectedNodePairs,
    selectedNodes: selection,
  };
};
