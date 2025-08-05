import { hasBoundingBox } from '~api/services/figma/intersections/has-bounding-box.ts';
import { isContainedIn } from '~api/services/figma/intersections/is-contained-in.ts';

export const areNodesIntersecting = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  if (!hasBoundingBox(selectedNode)) return false;

  return (
    hasBoundingBox(node) &&
    isContainedIn(node.absoluteBoundingBox, selectedNode.absoluteBoundingBox) &&
    'visible' in node &&
    node.visible
  );
};
