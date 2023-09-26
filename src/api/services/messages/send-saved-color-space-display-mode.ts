import { ClientStorageKeys } from '~api/types.ts';
import {
  type ColorSpaceDisplayModeChangeMessage,
  type MessagePayload,
  MessageTypes,
} from '~types/messages.ts';
import { notEmpty } from '~utils/not-empty.ts';

import { ColorSpaceDisplayModes } from '../../../constants.ts';

export const sendSavedColorSpaceDisplayMode = (): void => {
  retrieveSavedColorSpaceDisplayMode((mode) => {
    if (notEmpty(mode)) {
      postColorSpaceDisplayModeMessage(mode);
    } else {
      mode = ColorSpaceDisplayModes.OKLCH;
      setNewColorSpaceDisplayMode(mode);
    }
  });
};

const retrieveSavedColorSpaceDisplayMode = (
  callback: (mode: ColorSpaceDisplayModes | null) => void
): void => {
  void figma.clientStorage
    .getAsync(ClientStorageKeys.savedColorSpaceDisplayMode)
    .then(callback);
};

const setNewColorSpaceDisplayMode = (mode: ColorSpaceDisplayModes): void => {
  void figma.clientStorage.setAsync(
    ClientStorageKeys.savedColorSpaceDisplayMode,
    mode
  );
};

const postColorSpaceDisplayModeMessage = (
  mode: ColorSpaceDisplayModes
): void => {
  figma.ui.postMessage({
    payload: { colorSpaceDisplayMode: mode },
    type: MessageTypes.ColorSpaceDisplayModeChange,
  } satisfies MessagePayload<ColorSpaceDisplayModeChangeMessage>);
};
