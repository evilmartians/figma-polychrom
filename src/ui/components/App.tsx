import { useStore } from '@nanostores/react';
import { MessageTypes } from '~types/messages.ts';
import { EmptySelectionMessage } from '~ui/components/EmptySelectionMessage.tsx';
import { HelpLink } from '~ui/components/HelpLink.tsx';
import { LurkersLink } from '~ui/components/LurkersLink.tsx';
import { SelectionsList } from '~ui/components/SelectionsList.tsx';
import { SettingsButton } from '~ui/components/SettingsButton.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~ui/components/Tooltip.tsx';
import React, { useEffect } from 'react';

import { $isEmptySelection, $isP3 } from '../stores/selected-nodes';

export const App: React.FC = () => {
  const isEmptySelection = useStore($isEmptySelection);
  const isP3 = useStore($isP3);

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageTypes.UiReady,
        },
      },
      '*'
    );
  }, []);

  return (
    <div className="flex h-full w-full select-none flex-col items-center p-1 pb-0 font-martianMono">
      {isEmptySelection ? <EmptySelectionMessage /> : <SelectionsList />}

      <div className="mb-2 mt-auto flex w-full items-end px-1">
        <HelpLink />

        <div className="ml-auto flex items-center">
          {isP3 && (
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <p className="mr-3 rounded border-0.5 border-secondary-75 p-1 text-xxxs font-medium leading-[8px] text-secondary-75">
                    P3
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>File color profile</TooltipContent>
            </Tooltip>
          )}

          <SettingsButton />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <LurkersLink />
      </div>
    </div>
  );
};
