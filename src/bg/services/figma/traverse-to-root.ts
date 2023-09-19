import { notEmpty } from '~utils/not-empty.ts';

export const traverseToRoot = (node: SceneNode): SceneNode[] => {
  const parents: SceneNode[] = [];

  while (notEmpty(node)) {
    parents.unshift(node);
    node = node.parent as SceneNode;
  }

  return parents;
};
