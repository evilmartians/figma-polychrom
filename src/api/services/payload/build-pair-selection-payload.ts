import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { blendLayersColors } from '~api/services/figma/blend/blend-layers-colors.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { buildEmptyPayload } from '~api/services/payload/build-empty-payload.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { getActualNodeFill } from '~utils/figma/get-actual-node-fill.ts';
import { type HasLength } from '~utils/has-length.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const buildPairSelectionPayload = (
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
