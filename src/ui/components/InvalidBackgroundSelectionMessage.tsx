import layersImage from '~ui/assets/layers@2x.webp';
import { type ReactElement } from 'react';

export const InvalidBackgroundSelectionMessage = (): ReactElement => {
  return (
    <p
      style={{
        backgroundImage: `url(${layersImage})`,
      }}
      className="mx-auto flex h-[200px] w-[180px] select-none items-end justify-center bg-[length:180px_180px] bg-center bg-no-repeat pt-2 text-center font-martianMono text-xxs text-secondary-75"
    >
      The background layer should be a solid fill
    </p>
  );
};
