import { useStore } from '@nanostores/react';
import { MessageTypes } from '~types/messages.ts';
import clsx from 'clsx';
import React, { useEffect } from 'react';

import ufoImage from '../assets/ufo@2x.webp';
import {
  $colorSpaceDisplayMode,
  changeColorSpaceDisplayMode,
  colorSpaceDisplayModesList,
} from '../stores/color-space-display-mode.ts';
import { $userSelection } from '../stores/selected-nodes';
import { HelpIcon } from './HelpIcon.tsx';
import { LurkersIcon } from './LurkersIcon.tsx';
import { Selection } from './Selection';
import { SettingsIcon } from './SettingsIcon.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip.tsx';

export const App: React.FC = () => {
  const userSelection = useStore($userSelection);
  const colorSpaceDisplayMode = useStore($colorSpaceDisplayMode);

  const isMultipleSelection = userSelection.selectedNodePairs.length > 1;

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
      {userSelection.selectedNodes.length === 0 ||
      userSelection.selectedNodePairs.length === 0 ? (
        <p
          style={{
            backgroundImage: `url(${ufoImage})`,
          }}
          className="mx-auto mb-4 flex h-[200px] w-[180px] select-none items-end justify-center bg-[length:180px_180px] bg-center bg-no-repeat pt-2 text-center font-martian text-xxs text-gray-500 dark:text-gray-300"
        >
          Select a&nbsp;layer with a&nbsp;solid fill
        </p>
      ) : (
        <ul className={clsx('w-full', isMultipleSelection ? 'mb-4' : '')}>
          {userSelection.selectedNodePairs.map((pair, index) => (
            <li
              className={clsx(
                'flex w-full items-center justify-center',
                isMultipleSelection && index !== 0 ? '-mt-6' : ''
              )}
              key={pair.selectedNode.id}
            >
              <Selection
                isLast={index === userSelection.selectedNodePairs.length - 1}
                size={isMultipleSelection ? 'small' : 'large'}
                userSelection={pair}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex w-full items-end justify-between px-1">
        <Tooltip>
          <TooltipTrigger>
            <a
              className="interactive mb-2 flex h-6 w-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-gray-500 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25 dark:text-gray-300"
              href="https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell"
              rel="noreferrer"
              target="_blank"
            >
              <HelpIcon />
            </a>
          </TooltipTrigger>
          <TooltipContent>APCA in a Nutshell</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <a
              className="interactive"
              href="https://evilmartians.com/?utm_source=figma-plugin-apca-contrast"
              rel="noreferrer"
              target="_blank"
            >
              <LurkersIcon />
            </a>
          </TooltipTrigger>
          <TooltipContent>Evil Martians</TooltipContent>
        </Tooltip>

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
                    className={clsx(
                      !isActive ? 'opacity-70 dark:opacity-50' : ''
                    )}
                    key="mode"
                  >
                    {mode}
                  </span>
                );
              })}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
