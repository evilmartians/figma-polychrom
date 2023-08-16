import { hasBoundingBox } from './has-bounding-box.ts';
import { isContainedIn } from './is-contained-in.ts';
import { isDifferentNodeWithBoundingBox } from './is-different-node-with-bounding-box.ts';
import { nodeHasFills } from './node-has-fills.ts';

export const isNodeIntersecting = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  if (!hasBoundingBox(selectedNode)) return false;

  return (
    isDifferentNodeWithBoundingBox(node, selectedNode.id) &&
    isContainedIn(node.absoluteBoundingBox, selectedNode.absoluteBoundingBox) &&
    nodeHasFills(node)
  );
};
