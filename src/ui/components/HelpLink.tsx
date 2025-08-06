import { HelpIcon } from '~ui/components/HelpIcon.tsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';
import { type ReactElement } from 'preact/compat';

import { APCADocumentationURL } from '../../constants.ts';

export const HelpLink = (): ReactElement => {
  return (
    <Tooltip content={'APCA in a Nutshell'}>
      <a
        className="interactive flex h-6 w-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
        href={APCADocumentationURL}
        rel="noreferrer"
        target="_blank"
      >
        <HelpIcon />
      </a>
    </Tooltip>
  );
};
