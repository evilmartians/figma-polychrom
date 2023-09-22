import { areNodesIntersecting } from './are-nodes-intersecting.ts';

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
        traverseAndCheckIntersections(
          Array.from(node.children),
          selectedNode,
          accumulator
        );
      }
    }
  });

  return accumulator;
};
