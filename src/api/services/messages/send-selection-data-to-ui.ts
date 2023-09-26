import { buildMessagePayload } from '~api/services/payload/build-message-payload.ts';
import { getCurrentPageSelection } from '~api/services/selection/get-current-page-selection.ts';
import {
  type MessagePayload,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';

export const sendSelectionDataToUi = (): void => {
  const currentSelection = getCurrentPageSelection();

  const messagePayload = buildMessagePayload(currentSelection);

  figma.ui.postMessage({
    payload: messagePayload,
    type: MessageTypes.SelectionChange,
  } satisfies MessagePayload<SelectionChangeMessage>);
};
