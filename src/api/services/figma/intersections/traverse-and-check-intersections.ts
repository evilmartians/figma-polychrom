import { areNodesIntersecting } from './are-nodes-intersecting.ts';

export const getSiblingsBefore = (
  targetNode: SceneNode,
  allNodes: readonly SceneNode[]
): SceneNode[] => {
  const targetIndex = allNodes.indexOf(targetNode);
  return targetIndex === -1 ? [] : allNodes.slice(0, targetIndex);
};

const ifSelectedNodeIsChild = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  return (
    'children' in node && node.children.some((n) => n.id === selectedNode.id)
  );
};

// will return all nodes that are intersecting with selected node starting from depth a.k.a. neighboring nodes to the root a.k.a. PageNode
export const traverseAndCheckIntersections = (
  nodes: SceneNode[],
  selectedNode: SceneNode,
  accumulator: SceneNode[] = []
): SceneNode[] => {
  nodes.forEach((node) => {
    if (areNodesIntersecting(node, selectedNode)) {
      accumulator.push(node);

      if ('children' in node && node.children.length > 0) {
        if (ifSelectedNodeIsChild(node, selectedNode)) {
          const siblingsBefore = getSiblingsBefore(selectedNode, node.children);

          traverseAndCheckIntersections(
            siblingsBefore,
            selectedNode,
            accumulator
          );
        } else {
          traverseAndCheckIntersections(
            Array.from(node.children),
            selectedNode,
            accumulator
          );
        }
      }
    }
  });

  return accumulator;
};
