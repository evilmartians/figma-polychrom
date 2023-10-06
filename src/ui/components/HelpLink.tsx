import { HelpIcon } from '~ui/components/HelpIcon.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~ui/components/Tooltip.tsx';
import { type ReactElement } from 'react';

import { APCADocumentationURL } from '../../constants.ts';

export const HelpLink = (): ReactElement => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          className="interactive flex h-6 w-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
          href={APCADocumentationURL}
          rel="noreferrer"
          target="_blank"
        >
          <HelpIcon />
        </a>
      </TooltipTrigger>
      <TooltipContent>APCA in a Nutshell</TooltipContent>
    </Tooltip>
  );
};
