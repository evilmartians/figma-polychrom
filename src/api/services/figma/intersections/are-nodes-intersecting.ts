import { hasBoundingBox } from '~api/services/figma/intersections/has-bounding-box.ts';
import { isContainedIn } from '~api/services/figma/intersections/is-contained-in.ts';
import { isDifferentNodeWithBoundingBox } from '~api/services/figma/intersections/is-different-node-with-bounding-box.ts';

export const areNodesIntersecting = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  if (!hasBoundingBox(selectedNode)) return false;

  return (
    isDifferentNodeWithBoundingBox(node, selectedNode.id) &&
    isContainedIn(node.absoluteBoundingBox, selectedNode.absoluteBoundingBox) &&
    'visible' in node &&
    node.visible
  );
};
