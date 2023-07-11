import {
  type ColorSpaceDisplayModeChangeMessage,
  type MessagePayload,
  MessageTypes,
} from '../types/messages.ts';
import { ColorSpaceDisplayModes } from '../ui/stores/color-space-display-mode.ts';
import { ClientStorageKeys } from './constants.ts';

export const sendSavedColorSpaceDisplayMode = (): void => {
  void figma.clientStorage
    .getAsync(ClientStorageKeys.savedColorSpaceDisplayMode)
    .then((savedColorSpaceDisplayMode) => {
      if (savedColorSpaceDisplayMode == null) {
        void figma.clientStorage.setAsync(
          'colorSpaceDisplayMode',
          ColorSpaceDisplayModes.OKLCH
        );

        figma.ui.postMessage({
          payload: {
            colorSpaceDisplayMode: ColorSpaceDisplayModes.OKLCH,
          },
          type: MessageTypes.ColorSpaceDisplayModeChange,
        } satisfies MessagePayload<ColorSpaceDisplayModeChangeMessage>);
      } else {
        figma.ui.postMessage({
          payload: {
            colorSpaceDisplayMode: savedColorSpaceDisplayMode,
          },
          type: MessageTypes.ColorSpaceDisplayModeChange,
        } satisfies MessagePayload<ColorSpaceDisplayModeChangeMessage>);
      }
    });
};
