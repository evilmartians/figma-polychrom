import { useStore } from '@nanostores/preact';
import { SettingsIcon } from '~ui/components/SettingsIcon.tsx';
import {
  $colorSpaceDisplayMode,
  changeColorSpaceDisplayMode,
  colorSpaceDisplayModesList,
} from '~ui/stores/color-space-display-mode.ts';
import clsx from 'clsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';

export const SettingsButton = () => {
  const colorSpaceDisplayMode = useStore($colorSpaceDisplayMode);

  return (
    <Tooltip
      content={
        <div className="flex gap-x-2">
          {colorSpaceDisplayModesList.map((mode) => {
            const isActive = mode === colorSpaceDisplayMode;
            return (
              <span
                className={clsx(
                  !isActive ? 'opacity-70 dark:opacity-50' : 'font-bold'
                )}
                key={mode}
              >
                {mode}
              </span>
            );
          })}
        </div>
      }
    >
      <button
        onClick={changeColorSpaceDisplayMode}
        type="button"
        className="interactive flex h-6 w-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
      >
        <SettingsIcon />
      </button>
    </Tooltip>
  );
};
