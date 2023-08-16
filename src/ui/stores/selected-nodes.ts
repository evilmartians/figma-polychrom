import { atom, onMount } from 'nanostores';

import {
  type IncomingMessage,
  MessageTypes,
  type SelectionChangeMessage,
} from '../../types/common';

export const $userSelection = atom<SelectionChangeMessage>({
  selectedNodes: [],
  selectedNodesAndTheirBackgrounds: [],
});

onMount($userSelection, () => {
  const addMessageListener = (
    event: MessageEvent<IncomingMessage<SelectionChangeMessage>>
  ): void => {
    if (event.data?.pluginMessage.type === MessageTypes.SelectionChange) {
      $userSelection.set(event.data.pluginMessage.payload);
    }
  };

  window.addEventListener('message', addMessageListener);

  return () => {
    window.removeEventListener('message', addMessageListener);
  };
});
