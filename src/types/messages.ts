import { type ColorSpaceDisplayModes } from '../constants.ts';
import { type SelectedNodes } from './selection.ts';

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
  selectedNodePairs: SelectedNodes[];
  selectedNodes: readonly SceneNode[];
}

export interface ColorSpaceDisplayModeChangeMessage {
  colorSpaceDisplayMode: ColorSpaceDisplayModes;
}
