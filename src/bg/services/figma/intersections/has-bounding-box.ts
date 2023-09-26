import { notEmpty } from '~utils/not-empty.ts';

export const hasBoundingBox = (
  node: SceneNode
): node is SceneNode & { absoluteBoundingBox: Rect } =>
  'absoluteBoundingBox' in node && notEmpty(node.absoluteBoundingBox);
