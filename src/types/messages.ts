import { type ColorSpaceDisplayModes } from '../ui/stores/color-space-display-mode.ts';
import { type SelectedNodes } from './selection.ts';

export enum MessageTypes {
  ColorSpaceDisplayModeChange = 'ColorSpaceDisplayModeChange',
  SelectionChange = 'SelectionChange',
  UiReady = 'UiReady',
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

export interface UiReadyMessage {
  type: MessageTypes.UiReady;
}
