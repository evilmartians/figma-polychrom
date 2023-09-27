import { getComputedNodeFill } from '~api/services/colors/get-computed-node-fill.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { buildEmptyPayload } from '~api/services/payload/build-empty-payload.ts';
import {
  handleOpaqueBackground,
  handleTransparentBackground,
} from '~api/services/selection/process-node-from-multiple-selection.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { type HasLength } from '~utils/has-length.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const buildPairSelectionPayload = (
  selection: readonly SceneNode[] & HasLength<readonly SceneNode[], 2>
): SelectionChangeMessage => {
  const [firstNode, secondNode] = selection;

  const [fg, bg] = sortNodesByLayers([
    createFigmaNode(firstNode),
    createFigmaNode(secondNode),
  ]);

  if (!notEmpty(fg) || !notEmpty(bg)) return buildEmptyPayload();

  const fgFill = getComputedNodeFill(fg);

  if (!notEmpty(fgFill)) return buildEmptyPayload();

  if (isLayerHasTransparency(bg)) {
    const pair = handleTransparentBackground(fg.id, fgFill, [bg]);

    if (!notEmpty(pair)) return buildEmptyPayload();

    return {
      selectedNodePairs: [pair],
      selectedNodes: selection,
    };
  } else {
    const pair = handleOpaqueBackground(fg.id, fgFill, bg);

    if (!notEmpty(pair)) return buildEmptyPayload();

    return {
      selectedNodePairs: [pair],
      selectedNodes: selection,
    };
  }
};
