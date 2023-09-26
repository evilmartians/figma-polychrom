import { blendFills } from '~api/services/figma/blend/blend-fills.ts';
import { isLayerHasTransparency } from '~api/services/figma/visibility/is-layer-has-transparency.ts';
import { isLayerInvisible } from '~api/services/figma/visibility/is-layer-invisible.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';

export const blendLayersColors = (layers: FigmaNode[]): FigmaPaint | null => {
  const layersToBlend = getLayersToBlend(layers);
  const fillsToBlend = getFillsToBlend(layersToBlend);
  return blendFills(fillsToBlend);
};

const getLayersToBlend = (layers: FigmaNode[]): FigmaNode[] => {
  const visibleLayers = layers.filter((layer) => !isLayerInvisible(layer));

  const firstNonTransparentLayerIndex = visibleLayers.findIndex(
    (layer) => !isLayerHasTransparency(layer)
  );

  return visibleLayers.slice(0, firstNonTransparentLayerIndex + 1);
};

const getFillsToBlend = (layersToBlend: FigmaNode[]): FigmaPaint[] => {
  const allFills = layersToBlend.map((layer) => layer.fills.reverse()).flat();

  const visibleFills = allFills.filter(
    (fill) => fill.visible === true && fill.opacity !== 0
  );

  const firstNonTransparentFillIndex = visibleFills.findIndex(
    (fill) => fill.opacity === 1
  );

  return visibleFills.slice(0, firstNonTransparentFillIndex + 1).reverse();
};
