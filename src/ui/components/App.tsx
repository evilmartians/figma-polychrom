import { useStore } from '@nanostores/solid';
import { MessageTypes } from '~types/messages.ts';
import { AppContent } from '~ui/components/AppContent.tsx';
import { HelpLink } from '~ui/components/HelpLink.tsx';
import { LurkersLink } from '~ui/components/LurkersLink.tsx';
import { SettingsButton } from '~ui/components/SettingsButton.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~ui/components/Tooltip.tsx';
import { type JSX, onMount } from 'solid-js';

import { $isP3 } from '../stores/selected-nodes';

export const App = (): JSX.Element => {
  const isP3 = useStore($isP3);

  onMount(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageTypes.UiReady,
        },
      },
      '*'
    );
  });

  return (
    <div class="relative flex min-h-full w-full select-none flex-col items-center p-1 pb-0 font-martianMono">
      <AppContent />

      <div class="mb-2 mt-auto flex w-full items-end px-1">
        <HelpLink />

        <div class="ml-auto flex items-center">
          {isP3() && (
            <Tooltip>
              <TooltipTrigger>
                <div
                  style={{
                    'mix-blend-mode': 'difference',
                  }}
                  class="flex items-center"
                >
                  <p class="mr-3 rounded border-0.5 border-secondary-75 p-1 text-xxxs font-medium leading-[8px] text-secondary-75">
                    P3
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span>File color profile</span>
              </TooltipContent>
            </Tooltip>
          )}

          <SettingsButton />
        </div>
      </div>

      <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
        <LurkersLink />
      </div>
    </div>
  );
};
