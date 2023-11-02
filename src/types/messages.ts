import { type ColorSpace } from '~types/common.ts';
import { type PolychromNode } from '~types/figma.ts';

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

export enum SelectionMessageTypes {
  invalidBackground = 'invalidBackground',
  unprocessedBlendModes = 'unprocessedBlendModes',
}

export interface SelectionChangePayload {
  colorSpace: ColorSpace;
  selectedNodePairs: PolychromNode[];
}

export interface SelectionChangeMessage {
  colorSpace: ColorSpace;
  text: SelectionMessageTypes;
}

export type SelectionChangeEvent =
  | SelectionChangeMessage
  | SelectionChangePayload;

export interface ColorSpaceDisplayModeChangeMessage {
  colorSpaceDisplayMode: ColorSpaceDisplayModes;
}
