import { type MessagePayload, MessageTypes } from '../types/messages.ts';
import { type SelectionChangeMessage } from '../types/selection.ts';
import { calculateApcaScore } from './apca/calculate-apca-score';
import { createFigmaNode } from './figma/create-figma-node';
import { findClosestIntersectingNode } from './figma/find-closest-intersecting-node';
import { notEmpty } from './not-empty';

export const sendSelectionDataToUI = (): void => {
  const { selection } = figma.currentPage;

  let payload: SelectionChangeMessage;

  if (selection.length === 0) {
    payload = { selectedNodes: [], selectedNodesAndTheirBackgrounds: [] };
  } else if (selection.length === 2) {
    const [bgNode, fgNode] = selection;

    const bgFigmaNode = createFigmaNode(bgNode);
    const fgFigmaNode = createFigmaNode(fgNode);
    const [fgFirstFill] = fgFigmaNode.fills;
    const [bgFirstFill] = bgFigmaNode.fills;

    if (fgFirstFill == null || bgFirstFill == null) return;

    payload = {
      selectedNodes: selection,
      selectedNodesAndTheirBackgrounds: [
        {
          apca: calculateApcaScore(fgFirstFill, bgFirstFill),
          bgNode: bgFigmaNode,
          selectedNode: fgFigmaNode,
        },
      ],
    };
  } else {
    payload = {
      selectedNodes: selection,
      selectedNodesAndTheirBackgrounds: [...selection]
        .reverse()
        .map((node) => {
          const bgFigmaNode = findClosestIntersectingNode(node);

          if (bgFigmaNode == null) return null;

          const fgFigmaNode = createFigmaNode(node);

          const [fgFirstFill] = fgFigmaNode.fills;
          const [bgFirstFill] = bgFigmaNode.fills;

          if (fgFirstFill == null || bgFirstFill == null) return null;

          return {
            apca: calculateApcaScore(fgFirstFill, bgFirstFill),
            bgNode: bgFigmaNode,
            selectedNode: fgFigmaNode,
          };
        })
        .filter(notEmpty),
    };
  }

  figma.ui.postMessage({
    payload,
    type: MessageTypes.SelectionChange,
  } satisfies MessagePayload<SelectionChangeMessage>);
};
