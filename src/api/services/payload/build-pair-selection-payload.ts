import { buildColorsPair } from '~api/services/colors/build-colors-pair.ts';
import { getComputedNodeFill } from '~api/services/colors/get-computed-node-fill.ts';
import { createFigmaNode } from '~api/services/figma/nodes/create-figma-node.ts';
import { sortNodesByLayers } from '~api/services/figma/nodes/sort-nodes-by-layers.ts';
import { buildEmptyPayload } from '~api/services/payload/build-empty-payload.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { getFirstVisibleNodeFill } from '~utils/figma/get-first-visible-node-fill.ts';
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

  const fgFill = getComputedNodeFill(fg);

  const bgFill = getFirstVisibleNodeFill(bg.fills);

  if (!notEmpty(fgFill) || !notEmpty(bgFill)) return buildEmptyPayload();

  const nodePairPayload = buildColorsPair(fg.id, fgFill, bgFill);

  return notEmpty(nodePairPayload)
    ? { selectedNodePairs: [nodePairPayload], selectedNodes: selection }
    : buildEmptyPayload();
};
