import { processNodeFromMultipleSelection } from '~api/services/selection/process-node-from-multiple-selection.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { notEmpty } from '~utils/not-empty.ts';

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
): SelectionChangeMessage => {
  const selectedNodePairs = selection
    .map((selectedNode) => processNodeFromMultipleSelection(selectedNode))
    .filter(notEmpty);

  return {
    selectedNodePairs,
    selectedNodes: selection,
  };
};
