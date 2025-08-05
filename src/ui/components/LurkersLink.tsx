import { LurkersIcon } from '~ui/components/LurkersIcon.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~ui/components/Tooltip.tsx';
import { type ReactElement } from 'preact/compat';

import { evilMartiansSiteURL } from '../../constants.ts';

export const LurkersLink = (): ReactElement => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          className="interactive"
          href={evilMartiansSiteURL}
          rel="noreferrer"
          target="_blank"
        >
          <LurkersIcon />
        </a>
      </TooltipTrigger>
      <TooltipContent>Evil Martians</TooltipContent>
    </Tooltip>
  );
};
