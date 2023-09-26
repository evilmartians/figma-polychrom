import { isLayerHasTransparency } from '~bg/services/figma/is-layer-has-transparency.ts';
import { isLayerInvisible } from '~bg/services/figma/is-layer-invisible.ts';
import { createFigmaPaint } from '~test-utils/create-figma-paint.ts';
import { type FigmaNode, type FigmaPaint } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { blend } from 'culori';
import { type Rgb } from 'culori/fn';

export const blendLayersColors = (
  layers: FigmaNode[]
): FigmaPaint | undefined => {
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

export const blendFills = (
  fillsToBlend: FigmaPaint[]
): FigmaPaint | undefined => {
  const [firstColor] = fillsToBlend;

  if (notEmpty(firstColor)) {
    const firstColorPrepared: Rgb = {
      ...firstColor.color,
      alpha: firstColor.opacity,
      mode: 'rgb',
    };

    const result = fillsToBlend.reduce((acc, fill) => {
      const fillColorPrepared: Rgb = {
        ...fill.color,
        alpha: fill.opacity,
        mode: 'rgb',
      };

      return blend([acc, fillColorPrepared], 'normal', 'rgb');
    }, firstColorPrepared);

    return createFigmaPaint(result);
  }
};
