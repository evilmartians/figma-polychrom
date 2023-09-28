import { type SelectedNodes } from '~types/selection.ts';

import { type ColorSpaceDisplayModes } from '../constants.ts';

export enum MessageTypes {
  ColorSpaceDisplayModeChange = 'Polychrom_ColorSpaceDisplayModeChange',
  SelectionChange = 'Polychrom_SelectionChange',
  UiReady = 'Polychrom_UiReady',
}

export interface MessagePayload<T> {
  payload: T;
  type: MessageTypes;
}

export interface Message<T> {
  pluginMessage: MessagePayload<T>;
}

export interface SelectionChangeMessage {
  colorSpace: 'DISPLAY_P3' | 'LEGACY' | 'SRGB';
  selectedNodePairs: SelectedNodes[];
}

export interface ColorSpaceDisplayModeChangeMessage {
  colorSpaceDisplayMode: ColorSpaceDisplayModes;
}
