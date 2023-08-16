import { type Oklch } from 'culori';

export interface IncomingMessage<T> {
  pluginMessage: MessagePayload<T>;
}

export interface MessagePayload<T> {
  payload: T;
  type: MessageTypes;
}

export enum MessageTypes {
  SelectionChange = 'SelectionChange',
}

export interface SelectionChangeMessage {
  selectedNodes: readonly SceneNode[];
  selectedNodesAndTheirBackgrounds: SelectedNodesAndTheirBackgrounds[];
}

export interface SelectedNodesAndTheirBackgrounds {
  apca: null | number;
  bgNode: FigmaNode;
  selectedNode: FigmaNode;
}

export type FigmaPaint = SolidPaint & {
  hex: string;
  oklch: Oklch;
};

export interface FigmaNode {
  fills: readonly FigmaPaint[];
  id: string;
}
