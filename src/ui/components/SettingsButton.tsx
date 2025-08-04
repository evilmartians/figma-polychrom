import { useStore } from '@nanostores/solid';
import SettingsIcon from '~ui/assets/icons/settings-icon.svg';
import { Tooltip, TooltipContent, TooltipTrigger } from '~ui/components/Tooltip.tsx';
import {
  $colorSpaceDisplayMode,
  changeColorSpaceDisplayMode,
  colorSpaceDisplayModesList,
} from '~ui/stores/color-space-display-mode.ts';
import { createSignal, For, type JSX } from 'solid-js';

export const SettingsButton = (): JSX.Element => {
  const colorSpaceDisplayMode = useStore($colorSpaceDisplayMode);

  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Tooltip open={isOpen()}>
      <TooltipTrigger onClick={changeColorSpaceDisplayMode} onPointerEnter={() => setIsOpen(true)} onPointerLeave={() => setIsOpen(false)}>
        <button
          class="interactive flex size-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
          type="button"
        >
          <SettingsIcon />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p class="flex gap-x-2">
          {(() => {
            const currentColor = colorSpaceDisplayMode();
            return (
              <For each={colorSpaceDisplayModesList}>{
                (mode) => {
                const isActive = mode === currentColor;
                return (
                  <span
                    class={!isActive ? 'opacity-70 dark:opacity-50' : 'font-bold'}
                  >
                   {mode}
                 </span>
                );
              }}
              </For>
            );
          })()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
