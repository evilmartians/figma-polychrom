import {
  type Message,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';
import { atom, onMount } from 'nanostores';

export const $userSelection = atom<SelectionChangeMessage>({
  selectedNodePairs: [],
  selectedNodes: [],
});

onMount($userSelection, () => {
  const addMessageListener = (
    event: MessageEvent<Message<SelectionChangeMessage>>
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
