export const collectNodeParents = (
  node: PageNode | SceneNode,
  parents: SceneNode[] = []
): SceneNode[] => {
  if (node.parent != null) {
    if (node.parent.type === 'PAGE' || node.parent.type === 'DOCUMENT')
      return parents;

    parents.push(node.parent);

    collectNodeParents(node.parent, parents);
  }
  return parents;
};
