export enum MessageTypes {
  SelectionChange = 'SelectionChange',
}

export interface MessagePayload<T> {
  payload: T;
  type: MessageTypes;
}

export interface IncomingMessage<T> {
  pluginMessage: MessagePayload<T>;
}
