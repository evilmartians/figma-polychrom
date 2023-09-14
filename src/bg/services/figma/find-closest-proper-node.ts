import { getSiblingsBefore } from '~utils/figma/get-siblings-before.ts';
import { nodeHasFills } from '~utils/figma/node-has-fills.ts';
import { traverseToRoot } from '~utils/figma/traverse-to-root.ts';
import { notEmpty } from '~utils/not-empty.ts';

import { isNodeIntersecting } from './is-node-intersecting.ts';

const getLastIntersectingNode = (nodes: SceneNode[]): SceneNode | undefined => {
  return nodes.length > 0 ? nodes.pop() : undefined;
};

export const findClosestProperNode = (
  selectedNode: SceneNode
): PageNode | SceneNode | undefined => {
  const siblings = getSiblingsBefore(
    selectedNode,
    selectedNode.parent?.children ?? []
  );
  const potentialIntersectingNodes = siblings.filter(
    (node) => isNodeIntersecting(node, selectedNode) && nodeHasFills(node)
  );

  const intersectingSibling = getLastIntersectingNode(
    potentialIntersectingNodes
  );

  if (notEmpty(intersectingSibling)) return intersectingSibling;

  const parents = traverseToRoot(selectedNode);
  const potentialIntersectingParents = parents.filter(
    (node) => isNodeIntersecting(node, selectedNode) && nodeHasFills(node)
  );

  if (potentialIntersectingParents.length > 0) {
    return getLastIntersectingNode(potentialIntersectingParents);
  } else {
    return figma.currentPage;
  }
};
