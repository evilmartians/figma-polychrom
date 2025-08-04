import LurkersIcon from '~ui/assets/icons/lurkers-icon.svg';
import { Tooltip, TooltipContent, TooltipTrigger } from '~ui/components/Tooltip.tsx';
import { type JSX } from 'solid-js';

import { evilMartiansSiteURL } from '../../constants.ts';

export const LurkersLink = (): JSX.Element => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          class="interactive"
          href={evilMartiansSiteURL}
          rel="noreferrer"
          target="_blank"
        >
          <div class="relative overflow-hidden">
            <LurkersIcon />
          </div>
        </a>
      </TooltipTrigger>
      <TooltipContent><span class="whitespace-nowrap">Evil Martians</span></TooltipContent>
    </Tooltip>
  );
};
