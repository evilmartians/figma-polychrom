import HelpIcon from '~ui/assets/icons/help-icon.svg';
import { Tooltip, TooltipContent, TooltipTrigger } from '~ui/components/Tooltip.tsx';
import { type JSX } from 'solid-js';

import { APCADocumentationURL } from '../../constants.ts';

export const HelpLink = (): JSX.Element => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          class="interactive flex size-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
          href={APCADocumentationURL}
          rel="noreferrer"
          target="_blank"
        >
          <HelpIcon />
        </a>
      </TooltipTrigger>
      <TooltipContent><span class="whitespace-nowrap">APCA in a Nutshell</span></TooltipContent>
    </Tooltip>
  );
};
