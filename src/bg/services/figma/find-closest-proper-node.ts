import { type FigmaNode } from '~types/figma.ts';

import { isNodeIntersecting } from './is-node-intersecting.ts';

export const sortNodesByLayers = (nodes: FigmaNode[]): FigmaNode[] =>
  nodes.sort((a, b) => {
    const levelDifference = b.nestingLevel - a.nestingLevel;
    const zIndexDifference = Math.abs(b.zIndex ?? 0) - Math.abs(a.zIndex ?? 0);

    return levelDifference !== 0 ? levelDifference : zIndexDifference;
  });

// will return all nodes that are intersecting with selected node starting from depth a.k.a. neighboring nodes to the root a.k.a. PageNode
export const traverseAndCheckIntersections = (
  nodes: SceneNode[],
  selectedNode: SceneNode,
  accumulator: SceneNode[] = []
): SceneNode[] => {
  nodes.forEach((node) => {
    if (isNodeIntersecting(node, selectedNode)) {
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
