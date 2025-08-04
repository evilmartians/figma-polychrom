import type { JSX } from 'solid-js';

export const CantCalculateMessage = (): JSX.Element => (
  <p class="mx-auto mb-4 flex select-none items-end justify-center py-4 text-center font-martianMono text-xxs text-secondary-75">
    Can&apos;t calc
  </p>
);
