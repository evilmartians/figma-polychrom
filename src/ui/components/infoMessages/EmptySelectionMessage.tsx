import ufoImage from '~ui/assets/ufo@2x.webp';
import { type JSX } from 'solid-js';

export const EmptySelectionMessage = (): JSX.Element => (
  <p
    style={{
      'background-image': `url(${ufoImage})`,
    }}
    class="mx-auto flex h-[200px] w-[180px] select-none items-end justify-center bg-[length:180px_180px] bg-center bg-no-repeat pt-2 text-center font-martianMono text-xxs text-secondary-75"
  >
    Select a&nbsp;layer with a&nbsp;solid fill
  </p>
);
