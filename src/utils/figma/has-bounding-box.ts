export const hasBoundingBox = (
  node: SceneNode
): node is SceneNode & { absoluteBoundingBox: Rect } =>
  'absoluteBoundingBox' in node && node.absoluteBoundingBox != null;
