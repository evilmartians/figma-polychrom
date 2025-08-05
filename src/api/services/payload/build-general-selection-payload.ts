import { getIntersectingNodes } from '~api/services/figma/intersections/get-intersecting-nodes.ts';
import { hasOnlyValidBlendModes } from '~api/services/figma/nodes/has-only-valid-blend-modes.ts';
import { isValidForBackground } from '~api/services/figma/nodes/is-valid-for-background.ts';
import { isValidForSelection } from '~api/services/figma/nodes/is-valid-for-selection.ts';
import { type PolychromNode } from '~types/common.ts';
import {
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { notEmpty } from '~utils/not-empty.ts';

enum PairState {
  InvalidBackground = 'Invalid background',
  InvalidBlendMode = 'Has invalid blend mode',
}

const isValidSelection = (
  pair: PairState | PolychromNode
): pair is PolychromNode => {
  return (
    notEmpty(pair) &&
    pair !== PairState.InvalidBackground &&
    pair !== PairState.InvalidBlendMode
  );
};

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeEvent => {
  const selectedNodePairs = selection
    .filter(isValidForSelection)
    .map((selectedNode) => {
      const intersectingNodesTree = getIntersectingNodes(selectedNode);

      if (!hasOnlyValidBlendModes(intersectingNodesTree)) {
        return PairState.InvalidBlendMode;
      }

      if (isValidForBackground(intersectingNodesTree)) {
        return intersectingNodesTree;
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

  if (selectedNodePairs.some((pair) => pair === PairState.InvalidBlendMode)) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.unprocessedBlendModes,
    };
  }

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs: selectedNodePairs.filter(isValidSelection),
  };
};
