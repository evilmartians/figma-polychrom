import { LurkersIcon } from '~ui/components/LurkersIcon.tsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';
import { type ReactElement } from 'preact/compat';

import { evilMartiansSiteURL } from '../../constants.ts';

export const LurkersLink = (): ReactElement => (
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
