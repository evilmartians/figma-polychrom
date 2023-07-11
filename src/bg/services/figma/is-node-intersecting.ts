import { hasBoundingBox } from '../../../utils/figma/has-bounding-box.ts';
import { isContainedIn } from '../../../utils/figma/is-contained-in.ts';
import { isDifferentNodeWithBoundingBox } from '../../../utils/figma/is-different-node-with-bounding-box.ts';
import { nodeHasFills } from '../../../utils/figma/node-has-fills.ts';

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
