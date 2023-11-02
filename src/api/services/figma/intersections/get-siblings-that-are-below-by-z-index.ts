export const getSiblingsThatAreBelowByZIndex = (
  targetNode: SceneNode,
  allNodes: readonly SceneNode[]
): SceneNode[] => {
  const targetIndex = allNodes.indexOf(targetNode);

  return targetIndex === -1 ? [] : allNodes.slice(0, targetIndex + 1);
};
