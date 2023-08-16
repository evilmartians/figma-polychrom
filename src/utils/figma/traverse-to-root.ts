export const traverseToRoot = (node: SceneNode): SceneNode[] => {
  const parents: SceneNode[] = [];

  while (node != null) {
    parents.unshift(node);
    node = node.parent as SceneNode;
  }

  return parents;
};
