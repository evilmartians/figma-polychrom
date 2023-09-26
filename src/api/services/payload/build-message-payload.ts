import { buildEmptyPayload } from '~api/services/payload/build-empty-payload.ts';
import { buildGeneralSelectionPayload } from '~api/services/payload/build-general-selection-payload.ts';
import { buildPairSelectionPayload } from '~api/services/payload/build-pair-selection-payload.ts';
import { type SelectionChangeMessage } from '~types/messages.ts';
import { hasLength } from '~utils/has-length.ts';

export const buildMessagePayload = (
  currentSelection: readonly SceneNode[]
): SelectionChangeMessage => {
  if (currentSelection.length === 0) return buildEmptyPayload();

  if (hasLength(currentSelection, 2))
    return buildPairSelectionPayload(currentSelection);

  return buildGeneralSelectionPayload(currentSelection);
};
