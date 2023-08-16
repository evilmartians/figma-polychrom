export const getNodeFills = (node: SceneNode): Paint[] => {
  return 'fills' in node
    ? typeof node.fills === 'symbol'
      ? []
      : Array.from(node.fills)
    : [];
};
