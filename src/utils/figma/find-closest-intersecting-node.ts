import { formatHex, oklch } from 'culori';

import { type FigmaNode } from '../../types/figma.ts';
import { createFigmaNode } from './create-figma-node';
import { getSiblingsBefore } from './get-siblings-before.ts';
import { isNodeIntersecting } from './is-node-intersecting.ts';
import { traverseToRoot } from './traverse-to-root.ts';

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
  const potentialIntersectingNodes = siblings
    .filter((node) => isNodeIntersecting(node, selectedNode))
    .map(createFigmaNode);
  const intersectingSibling = getLastIntersectingNode(
    potentialIntersectingNodes
  );

  if (intersectingSibling != null) return intersectingSibling;

  const parents = traverseToRoot(selectedNode);
  const potentialIntersectingParents = parents
    .filter((node) => isNodeIntersecting(node, selectedNode))
    .map(createFigmaNode);

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
