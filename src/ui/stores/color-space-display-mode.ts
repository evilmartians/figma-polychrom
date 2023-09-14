import {
  type ColorSpaceDisplayModeChangeMessage,
  type Message,
  type MessagePayload,
  MessageTypes,
} from '~types/messages.ts';
import { atom, onMount, onSet } from 'nanostores';

import { ColorSpaceDisplayModes } from '../../constants.ts';

export const colorSpaceDisplayModesList = Object.values(ColorSpaceDisplayModes);

export const $colorSpaceDisplayMode = atom<ColorSpaceDisplayModes>(
  ColorSpaceDisplayModes.OKLCH
);

export const changeColorSpaceDisplayMode = (): void => {
  const previous = $colorSpaceDisplayMode.get();

  const previousIndex = colorSpaceDisplayModesList.findIndex(
    (mode) => mode === previous
  );

  const nextIndex =
    previousIndex >= colorSpaceDisplayModesList.length - 1
      ? 0
      : previousIndex + 1;

  const nextValue = colorSpaceDisplayModesList[nextIndex];

  if (nextValue) $colorSpaceDisplayMode.set(nextValue);
};

onSet($colorSpaceDisplayMode, (mode) => {
  parent.postMessage(
    {
      pluginMessage: {
        payload: {
          colorSpaceDisplayMode: mode.newValue,
        },
        type: MessageTypes.ColorSpaceDisplayModeChange,
      } satisfies MessagePayload<ColorSpaceDisplayModeChangeMessage>,
    },
    '*'
  );
});

onMount($colorSpaceDisplayMode, () => {
  const addMessageListener = (
    event: MessageEvent<Message<ColorSpaceDisplayModeChangeMessage>>
  ): void => {
    if (
      event.data?.pluginMessage.type ===
      MessageTypes.ColorSpaceDisplayModeChange
    ) {
      $colorSpaceDisplayMode.set(
        event.data.pluginMessage.payload.colorSpaceDisplayMode
      );
    }
  };

  window.addEventListener('message', addMessageListener);

  return () => {
    window.removeEventListener('message', addMessageListener);
  };
});
