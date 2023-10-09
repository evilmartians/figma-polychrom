import {
  type Message,
  MessageTypes,
  type SelectionChangeEvent,
  SelectionMessageTypes,
} from '~types/messages.ts';
import { renderAndBlendColors } from '~ui/services/colors/render-and-blend-colors.ts';
import { atom, computed, onMount } from 'nanostores';

export const $userSelection = atom<SelectionChangeEvent>({
  colorSpace: 'SRGB',
  selectedNodePairs: [],
});

export const $contrastConclusion = computed($userSelection, (selection) => {
  if ('selectedNodePairs' in selection) {
    return renderAndBlendColors(
      selection.selectedNodePairs,
      selection.colorSpace
    );
  }
});

export const $isP3 = computed($userSelection, (selection) => {
  return 'colorSpace' in selection
    ? selection.colorSpace === 'DISPLAY_P3'
    : false;
});

export const $isMultiSelection = computed($userSelection, (selection) => {
  return 'selectedNodePairs' in selection
    ? selection.selectedNodePairs.length > 1
    : false;
});

export const $isInvalidBackground = computed($userSelection, (selection) => {
  return (
    'text' in selection &&
    selection.text === SelectionMessageTypes.invalidBackground
  );
});

export const $isEmptySelection = computed(
  $contrastConclusion,
  (selection) => selection?.length === 0
);

onMount($userSelection, () => {
  const addMessageListener = (
    event: MessageEvent<Message<SelectionChangeEvent>>
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
