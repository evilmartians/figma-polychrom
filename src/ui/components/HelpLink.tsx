import { HelpIcon } from '~ui/components/HelpIcon.tsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';
import { type JSX } from 'preact';

import { APCADocumentationURL } from '../../constants.ts';

export const HelpLink = (): JSX.Element => (
  <Tooltip content={'APCA in a Nutshell'}>
    <a
      className="interactive flex size-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
      href={APCADocumentationURL}
      rel="noreferrer"
      target="_blank"
    >
      <HelpIcon />
    </a>
  </Tooltip>
);
