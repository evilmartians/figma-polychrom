import { type PolychromNode } from '~types/common.ts';
import { type FigmaColorSpace } from '~types/figma.ts';

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
  colorSpace: FigmaColorSpace;
  selectedNodePairs: PolychromNode[];
}

export interface SelectionChangeMessage {
  colorSpace: FigmaColorSpace;
  text: SelectionMessageTypes;
}

export type SelectionChangeEvent =
  | SelectionChangeMessage
  | SelectionChangePayload;

export interface ColorSpaceDisplayModeChangeMessage {
  colorSpaceDisplayMode: ColorSpaceDisplayModes;
}
