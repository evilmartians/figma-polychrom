import {
  isLayerHasTransparency,
  isLayerInvisible,
} from '~bg/services/figma/is-layer-has-transparency.ts';
import { type FigmaNode } from '~types/figma.ts';
import { notEmpty } from '~utils/not-empty.ts';
import { blend } from 'culori';
import { formatHex, type Rgb } from 'culori/fn';

export const blendLayersColors = (layers: FigmaNode[]): string | undefined => {
  const visibleLayers = layers.filter((layer) => !isLayerInvisible(layer));

  const firstNonTransparentLayerIndex = visibleLayers.findIndex(
    (layer) => !isLayerHasTransparency(layer)
  );

  const layersToBlend = visibleLayers.slice(
    0,
    firstNonTransparentLayerIndex + 1
  );

  const allFills = layersToBlend.map((layer) => layer.fills.reverse()).flat();

  const visibleFills = allFills.filter(
    (fill) => fill.visible === true && fill.opacity !== 0
  );

  const firstNonTransparentFillIndex = visibleFills.findIndex(
    (fill) => fill.opacity === 1
  );

  const fillsToBlend = visibleFills
    .slice(0, firstNonTransparentFillIndex + 1)
    .reverse();

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

    return formatHex(result);
  }
};
