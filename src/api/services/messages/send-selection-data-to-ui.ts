import { buildMessagePayload } from '~api/services/payload/build-message-payload.ts';
import { getCurrentPageSelection } from '~api/services/selection/get-current-page-selection.ts';
import {
  type MessagePayload,
  MessageTypes,
  type SelectionChangeEvent,
} from '~types/messages.ts';

export const sendSelectionDataToUi = (): void => {
  try {
    const currentSelection = getCurrentPageSelection();

    const messagePayload = buildMessagePayload(currentSelection);

    figma.ui.postMessage({
      payload: messagePayload,
      type: MessageTypes.SelectionChange,
    } satisfies MessagePayload<SelectionChangeEvent>);
  } catch (error) {
    figma.ui.postMessage({
      payload: {
        colorSpace: figma.root.documentColorProfile,
        selectedNodePairs: [],
      },
      type: MessageTypes.SelectionChange,
    } satisfies MessagePayload<SelectionChangeEvent>);
  }
};
