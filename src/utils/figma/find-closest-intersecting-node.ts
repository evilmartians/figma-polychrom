import { formatHex, oklch } from 'culori';

import { type FigmaNode } from '../../types/common';
import { createFigmaNode } from './create-figma-node';
import { getNodeFills } from './get-node-fills';
import { hasBoundingBox } from './has-bounding-box';
import { isContainedIn } from './is-contained-in';
import { isDifferentNodeWithBoundingBox } from './is-different-node-with-bounding-box';

const traverseToRoot = (node: SceneNode): SceneNode[] => {
  const parents: SceneNode[] = [];

  while (node != null) {
    parents.unshift(node);
    node = node.parent as SceneNode;
  }

  return parents;
};

const getSiblingsBefore = (
  targetNode: SceneNode,
  allNodes: readonly SceneNode[]
): SceneNode[] => {
  const targetIndex = allNodes.indexOf(targetNode);
  return targetIndex === -1 ? [] : allNodes.slice(0, targetIndex);
};

const nodeHasFills = (node: SceneNode): boolean =>
  getNodeFills(node).some((fill) => fill.type === 'SOLID');

const isNodeIntersecting = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  if (!hasBoundingBox(selectedNode)) return false;

  return (
    isDifferentNodeWithBoundingBox(node, selectedNode.id) &&
    isContainedIn(node.absoluteBoundingBox, selectedNode.absoluteBoundingBox) &&
    nodeHasFills(node)
  );
};

const createFilteredFigmaNodes = (
  nodes: SceneNode[],
  selectedNode: SceneNode
): FigmaNode[] => {
  return nodes
    .filter((node) => isNodeIntersecting(node, selectedNode))
    .map(createFigmaNode);
};

const getLastIntersectingNode = (nodes: FigmaNode[]): FigmaNode | undefined => {
  return nodes.length > 0 ? nodes.pop() : undefined;
};

export const findClosestIntersectingNode = (
  selectedNode: SceneNode
): FigmaNode | undefined => {
  const siblings = getSiblingsBefore(
    selectedNode,
    selectedNode.parent?.children ?? []
  );
  const potentialIntersectingNodes = createFilteredFigmaNodes(
    siblings,
    selectedNode
  );
  const intersectingSibling = getLastIntersectingNode(
    potentialIntersectingNodes
  );

  if (intersectingSibling != null) return intersectingSibling;

  const parents = traverseToRoot(selectedNode);
  const potentialIntersectingParents = createFilteredFigmaNodes(
    parents,
    selectedNode
  );

  if (potentialIntersectingParents.length > 0) {
    return getLastIntersectingNode(potentialIntersectingParents);
  } else {
    const solidFills = figma.currentPage.backgrounds.filter(
      (fill): fill is SolidPaint => fill.type === 'SOLID'
    );

    return {
      fills: solidFills.map((fill) => ({
        ...fill,
        hex: formatHex({ ...fill.color, mode: 'rgb' }),
        oklch: oklch({ ...fill.color, mode: 'rgb' }, 'oklch'),
      })),
      id: figma.currentPage.id,
    };
  }
};
