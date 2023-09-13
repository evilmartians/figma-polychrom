import { ClientStorageKeys } from '~bg/constants.ts';

import { type MessagePayload, MessageTypes } from '../types/messages.ts';
import { sendSavedColorSpaceDisplayMode } from './services/messages/send-saved-color-space-display-mode.ts';
import { sendSelectionDataToUI } from './services/messages/send-selection-data-to-ui.ts';

figma.skipInvisibleInstanceChildren = true;

figma.showUI(__html__, {
  height: 260,
  themeColors: true,
  width: 328,
});

figma.on('selectionchange', sendSelectionDataToUI);
figma.on('run', sendSelectionDataToUI);
figma.on('documentchange', sendSelectionDataToUI);

figma.on('close', () => {
  figma.off('selectionchange', sendSelectionDataToUI);
  figma.off('run', sendSelectionDataToUI);
  figma.off('documentchange', sendSelectionDataToUI);
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