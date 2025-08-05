import { getActualFill } from '~utils/figma/get-actual-fill.ts';
import { notEmpty } from '~utils/not-empty.ts';

// TODO: Improve if there are any non solid visible fills with opacity.

export const isValidForSelection = (node: SceneNode): boolean => {
  if (!node.visible) {
    return false;
  }

  if ('opacity' in node && node.opacity === 0) return false;

  if ('fills' in node) {
    if (typeof node.fills === 'symbol') {
      return false;
    } else {
      const actualFill = getActualFill(node.fills);

      if (notEmpty(actualFill)) {
        return actualFill.type === 'SOLID';
      } else {
        return false;
      }
    }
  }

  return false;
};
