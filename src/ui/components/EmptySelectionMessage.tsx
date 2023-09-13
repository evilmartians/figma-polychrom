import ufoImage from '~ui/assets/ufo@2x.webp';
import { type ReactElement } from 'react';

export const EmptySelectionMessage = (): ReactElement => {
  return (
    <p
      style={{
        backgroundImage: `url(${ufoImage})`,
      }}
      className="mx-auto mb-4 flex h-[200px] w-[180px] select-none items-end justify-center bg-[length:180px_180px] bg-center bg-no-repeat pt-2 text-center font-martian text-xxs text-gray-500 dark:text-gray-300"
    >
      Select a&nbsp;layer with a&nbsp;solid fill
    </p>
  );
};