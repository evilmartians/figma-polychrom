import layersImage from '~ui/assets/layers@2x.webp';
import { type JSX } from 'solid-js';

export const UnprocessedBlendModesSelectionMessage = (): JSX.Element => (
  <p
    style={{
      'background-image': `url(${layersImage})`,
    }}
    class="mx-auto flex h-[200px] w-[250px] select-none items-end justify-center bg-[length:180px_180px] bg-center bg-no-repeat pt-2 text-center font-martianMono text-xxs text-secondary-75"
  >
    The blending mode Plus Darker is not supported
  </p>
);
