import { buildGeneralSelectionPayload } from '~api/services/payload/build-general-selection-payload.ts';
import { buildPairSelectionPayload } from '~api/services/payload/build-pair-selection-payload.ts';
import { type SelectionChangeEvent } from '~types/messages.ts';

export const buildMessagePayload = (
  currentSelection: readonly SceneNode[]
): SelectionChangeEvent => {
  if (currentSelection.length === 0)
    return {
      colorSpace: figma.root.documentColorProfile,
      selectedNodePairs: [],
    };

  if (currentSelection.length === 2) {
    return buildPairSelectionPayload(currentSelection);
  }

  return buildGeneralSelectionPayload(currentSelection);
};
