// import { type PolychromNode, type FigmaPaint } from '~types/figma.ts';
// import { isEmpty, notEmpty } from '~utils/not-empty.ts';
//
// // PLUS_LIGHTER is LINEAR_DODGE
// // PLUS_DARKER is LINEAR_BURN
// const unprocessedBlendModes = ['LINEAR_BURN', 'LINEAR_DODGE'];
//
// const isVisibleSolidFill = (fill: FigmaPaint): boolean =>
//   fill.visible === true &&
//   (notEmpty(fill.opacity) ? fill.opacity > 0 : true) &&
//   fill.type === 'SOLID';
//
// const hasValidBlendMode = (fill: FigmaPaint): boolean => {
//   if (isEmpty(fill.blendMode)) return true;
//
//   return !unprocessedBlendModes.includes(fill.blendMode);
// };
//
// export const hasOnlyValidBlendModes = (nodes: PolychromNode[]): boolean =>
//   nodes.every(
//     (node) =>
//       node.fills
//         .filter((fill) => isVisibleSolidFill(fill))
//         .every(hasValidBlendMode) &&
//       !unprocessedBlendModes.includes(node.blendMode)
//   );
