import { effect } from '@preact/signals';
import { MessageTypes } from '~types/messages.ts';
import { AppContent } from '~ui/components/AppContent.tsx';
import { HelpLink } from '~ui/components/HelpLink.tsx';
import { LurkersLink } from '~ui/components/LurkersLink.tsx';
import { SettingsButton } from '~ui/components/SettingsButton.tsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';
import { useStore } from '@nanostores/preact';
import { $isP3 } from '~ui/stores/selected-nodes.ts';

export const App = () => {
  const isP3 = useStore($isP3);

  effect(() => {
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
    <div className="relative flex min-h-full w-full select-none flex-col items-center p-1 pb-0 font-martianMono">
      <AppContent />

      <div className="mb-2 mt-auto flex w-full items-end px-1">
        <HelpLink />
        <div className="ml-auto flex items-center">
          {isP3 && (
            <Tooltip content={'File color profile'}>
              <div
                style={{
                  mixBlendMode: 'difference',
                }}
                className="flex items-center"
              >
                <p className="mr-3 rounded border-0.5 border-secondary-75 p-1 text-xxxs font-medium leading-[8px] text-secondary-75">
                  P3
                </p>
              </div>
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
