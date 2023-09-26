import { type SelectionChangeMessage } from '~types/messages.ts';

export const buildEmptyPayload = (): SelectionChangeMessage => ({
  selectedNodePairs: [],
  selectedNodes: [],
});
