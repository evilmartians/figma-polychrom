import { sendSelectionDataToUI } from '../utils/send-selection-data-to-ui';

figma.skipInvisibleInstanceChildren = true;

figma.showUI(__html__, {
  height: 315,
  themeColors: true,
  width: 340,
});

figma.on('selectionchange', sendSelectionDataToUI);
figma.on('run', sendSelectionDataToUI);
figma.on('documentchange', sendSelectionDataToUI);

figma.on('close', () => {
  figma.off('selectionchange', sendSelectionDataToUI);
  figma.off('run', sendSelectionDataToUI);
  figma.off('documentchange', sendSelectionDataToUI);
});
