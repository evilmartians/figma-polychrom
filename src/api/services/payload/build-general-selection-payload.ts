import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
// import { hasOnlyValidBlendModes } from '~api/services/figma/nodes/has-only-valid-blend-modes.ts';
import { isValidForBackground } from '~api/services/figma/nodes/is-valid-for-background.ts';
import { isValidForSelection } from '~api/services/figma/nodes/is-valid-for-selection.ts';
import {
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { type SelectedNodes } from '~types/selection.ts';
import { notEmpty } from '~utils/not-empty.ts';

enum PairState {
  InvalidBackground = 'Invalid background',
  InvalidBlendMode = 'Has invalid blend mode',
}

const isSelectedNodes = (
  pair: PairState | SelectedNodes
): pair is SelectedNodes => {
  return notEmpty((pair as SelectedNodes).intersectingNodes);
};

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeEvent => {
  const selectedNodePairs = selection
    .filter(isValidForSelection)
    .map((selectedNode) => {
      const intersectingNodes = getIntersectingNodes(selectedNode);
      const selectedFigmaNode = createFigmaNode(selectedNode);

      // if (!hasOnlyValidBlendModes([selectedFigmaNode, ...intersectingNodes])) {
      //   return PairState.InvalidBlendMode;
      // }

      if (isValidForBackground(intersectingNodes)) {
        return {
          intersectingNodes: getIntersectingNodes(selectedNode),
          selectedNodeWithIntersectingNodes: [selectedFigmaNode],
        };
      } else {
        return PairState.InvalidBackground;
      }
    });

  const isSingleInvalidBackground =
    selectedNodePairs.some((pair) => pair === PairState.InvalidBackground) &&
    selectedNodePairs.length === 1;
  const areAllInvalidBackgrounds =
    selectedNodePairs.length > 1 &&
    selectedNodePairs.every((pair) => pair === PairState.InvalidBackground);

  if (isSingleInvalidBackground || areAllInvalidBackgrounds) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.invalidBackground,
    };
  }

  // if (selectedNodePairs.some((pair) => pair === PairState.InvalidBlendMode)) {
  //   return {
  //     colorSpace: figma.root.documentColorProfile,
  //     text: SelectionMessageTypes.unprocessedBlendModes,
  //   };
  // }

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs: selectedNodePairs.filter(isSelectedNodes),
  };
};
