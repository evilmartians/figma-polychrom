import { useStore } from '@nanostores/react';
import { SettingsIcon } from '~ui/components/SettingsIcon.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~ui/components/Tooltip.tsx';
import {
  $colorSpaceDisplayMode,
  changeColorSpaceDisplayMode,
  colorSpaceDisplayModesList,
} from '~ui/stores/color-space-display-mode.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

export const SettingsButton = (): ReactElement => {
  const colorSpaceDisplayMode = useStore($colorSpaceDisplayMode);

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          className="interactive mb-2 flex h-6 w-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-gray-500 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25 dark:text-gray-300"
          onClick={changeColorSpaceDisplayMode}
          type="button"
        >
          <SettingsIcon />
        </button>
      </TooltipTrigger>

      <TooltipContent>
        <p className="flex gap-x-2">
          {colorSpaceDisplayModesList.map((mode) => {
            const isActive = mode === colorSpaceDisplayMode;

            return (
              <span
                className={clsx(!isActive ? 'opacity-70 dark:opacity-50' : '')}
                key="mode"
              >
                {mode}
              </span>
            );
          })}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};