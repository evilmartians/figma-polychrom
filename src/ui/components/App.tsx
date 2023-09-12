import { useStore } from '@nanostores/react';
import { MessageTypes } from '~types/messages.ts';
import { EmptySelectionMessage } from '~ui/components/EmptySelectionMessage.tsx';
import { HelpLink } from '~ui/components/HelpLink.tsx';
import { LurkersLink } from '~ui/components/LurkersLink.tsx';
import { SelectionsList } from '~ui/components/SelectionsList.tsx';
import { SettingsButton } from '~ui/components/SettingsButton.tsx';
import React, { useEffect } from 'react';

import { $isEmptySelection } from '../stores/selected-nodes';

export const App: React.FC = () => {
  const isEmptySelection = useStore($isEmptySelection);

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
    <div className="flex h-full w-full select-none flex-col items-center p-1 pb-0 font-martian">
      {isEmptySelection ? <EmptySelectionMessage /> : <SelectionsList />}

      <div className="mt-auto flex w-full items-end justify-between px-1">
        <HelpLink />

        <LurkersLink />

        <SettingsButton />
      </div>
    </div>
  );
};
