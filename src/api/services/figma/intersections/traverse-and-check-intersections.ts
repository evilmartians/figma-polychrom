import { getSiblingsThatAreBelowByZIndex } from '~api/services/figma/intersections/get-siblings-that-are-below-by-z-index.ts';

import { areNodesIntersecting } from './are-nodes-intersecting.ts';

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
          const siblingsBefore = getSiblingsThatAreBelowByZIndex(
            selectedNode,
            node.children
          );

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
