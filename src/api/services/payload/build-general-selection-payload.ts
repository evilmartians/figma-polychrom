import { processNodeForSelection } from '~api/services/selection/process-node-for-selection.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const buildGeneralSelectionPayload = (
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
