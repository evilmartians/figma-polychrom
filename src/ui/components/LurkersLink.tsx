import { LurkersIcon } from '~ui/components/LurkersIcon.tsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';
import { type JSX } from 'preact';

import { evilMartiansSiteURL } from '../../constants.ts';

export const LurkersLink = (): JSX.Element => (
  <Tooltip content="Evil Martians">
    <a
      className="interactive"
      href={evilMartiansSiteURL}
      rel="noreferrer"
      target="_blank"
    >
      <LurkersIcon />
    </a>
  </Tooltip>
);
