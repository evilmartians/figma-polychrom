import { hasBoundingBox } from '~bg/services/figma/has-bounding-box.ts';
import { isContainedIn } from '~bg/services/figma/is-contained-in.ts';
import { isDifferentNodeWithBoundingBox } from '~bg/services/figma/is-different-node-with-bounding-box.ts';

export const isNodeIntersecting = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  if (!hasBoundingBox(selectedNode)) return false;

  return (
    isDifferentNodeWithBoundingBox(node, selectedNode.id) &&
    isContainedIn(node.absoluteBoundingBox, selectedNode.absoluteBoundingBox)
  );
};
