import { hasBoundingBox } from './has-bounding-box';

export const isDifferentNodeWithBoundingBox = (
  node: SceneNode,
  selectedNodeId: string
): node is SceneNode & { absoluteBoundingBox: Rect } =>
  node.id !== selectedNodeId && hasBoundingBox(node);
