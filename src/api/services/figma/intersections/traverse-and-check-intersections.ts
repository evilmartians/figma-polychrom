import { createPolychromNode } from '~api/services/figma/nodes/create-polychrom-node.ts';
import { type PolychromNode } from '~types/common.ts';

import { areNodesIntersecting } from './are-nodes-intersecting.ts';
import { getSiblingsThatAreBelowByZIndex } from './get-siblings-that-are-below-by-z-index.ts';

const ifSelectedNodeIsChild = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  return (
    'children' in node && node.children.some((n) => n.id === selectedNode.id)
  );
};

export const traverseAndCheckIntersections = (
  nodes: SceneNode[],
  selectedNode: SceneNode
): PolychromNode[] => {
  return nodes.reduce((accumulator: PolychromNode[], node) => {
    if (areNodesIntersecting(node, selectedNode)) {
      const polychromNode = createPolychromNode(node, selectedNode.id);

      if ('children' in node && node.children.length > 0) {
        const childrenNodes = ifSelectedNodeIsChild(node, selectedNode)
          ? getSiblingsThatAreBelowByZIndex(selectedNode, node.children)
          : Array.from(node.children);

        polychromNode.children = traverseAndCheckIntersections(
          childrenNodes,
          selectedNode
        );
      }

      accumulator.push(polychromNode);
    }

    return accumulator;
  }, []);
};
