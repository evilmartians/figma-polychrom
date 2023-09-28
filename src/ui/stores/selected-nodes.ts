import {
  type Message,
  MessageTypes,
  type SelectionChangeMessage,
} from '~types/messages.ts';
import { summarizeTheColors } from '~ui/services/colors/summarize-the-colors.ts';
import { atom, computed, onMount } from 'nanostores';

export const $userSelection = atom<SelectionChangeMessage>({
  colorSpace: 'SRGB',
  selectedNodePairs: [],
});

export const processedUserSelection = computed($userSelection, (selection) => {
  return summarizeTheColors(selection.selectedNodePairs, selection.colorSpace);
});

export const $isMultiSelection = computed(
  $userSelection,
  (selection) => selection.selectedNodePairs.length > 1
);
export const $isEmptySelection = computed(
  $userSelection,
  (selection) => selection.selectedNodePairs.length === 0
);

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
