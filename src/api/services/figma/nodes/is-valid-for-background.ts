import { getActualNodeFill } from '~api/services/figma/nodes/get-actual-node-fill.ts';
import { getActualNode } from '~api/services/figma/nodes/get-actual-node.ts';
import { type FigmaNode } from '~types/figma.ts';
import { isEmpty } from '~utils/not-empty.ts';

export const isValidForBackground = (nodes: FigmaNode[]): boolean => {
  const actualNode = getActualNode(nodes);

  if (isEmpty(actualNode)) return false;

  const actualFill = getActualNodeFill(actualNode?.fills);

  if (isEmpty(actualFill)) return false;

  return actualFill.type === 'SOLID';
};
