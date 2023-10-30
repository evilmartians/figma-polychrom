import { type FigmaNode } from '~types/figma.ts';
import { getActualNodeFill } from '~utils/get-actual-node-fill.ts';
import { getActualNode } from '~utils/get-actual-node.ts';
import { isEmpty } from '~utils/not-empty.ts';

// TODO: Improve if there are any non solid visible fills with opacity.

export const isValidForBackground = (nodes: FigmaNode[]): boolean => {
  const actualNode = getActualNode(nodes);

  if (isEmpty(actualNode)) return false;

  const actualFill = getActualNodeFill(actualNode?.fills);

  if (isEmpty(actualFill)) return false;

  return actualFill.type === 'SOLID';
};
