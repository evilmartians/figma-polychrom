import { sendSelectionDataToUi } from '~api/services/messages/send-selection-data-to-ui.ts';

import { type MessagePayload, MessageTypes } from '../types/messages.ts';
import { sendSavedColorSpaceDisplayMode } from './services/messages/send-saved-color-space-display-mode.ts';
import { ClientStorageKeys } from './types.ts';

figma.skipInvisibleInstanceChildren = true;

figma.showUI(__html__, {
  height: 260,
  themeColors: true,
  width: 328,
});

figma.on('selectionchange', sendSelectionDataToUi);
figma.on('run', sendSelectionDataToUi);
figma.on('documentchange', sendSelectionDataToUi);

figma.on('close', () => {
  figma.off('selectionchange', sendSelectionDataToUi);
  figma.off('run', sendSelectionDataToUi);
  figma.off('documentchange', sendSelectionDataToUi);
});

figma.ui.onmessage = (message: MessagePayload<any>) => {
  if (message.type === MessageTypes.ColorSpaceDisplayModeChange) {
    void figma.clientStorage.setAsync(
      ClientStorageKeys.savedColorSpaceDisplayMode,
      message.payload.colorSpaceDisplayMode
    );
  }

  if (message.type === MessageTypes.UiReady) {
    sendSavedColorSpaceDisplayMode();
  }
};
