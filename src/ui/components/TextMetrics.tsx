import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { conclusions } from '~ui/services/apca/conclusion.ts';
import { fontLookupAPCA } from 'apca-w3';
import { type ReactElement } from 'react';

import { PictureIcon } from './PictureIcon.tsx';
import { StopIcon } from './StopIcon.tsx';
import { WarningIcon } from './WarningIcon.tsx';

interface Props {
  apca: number;
}

export const TextMetrics = ({ apca }: Props): ReactElement => {
  const [, , , , regular, , , bold] = fontLookupAPCA(apca);

  if (Math.abs(apca) < conclusions['Not Readable']) {
    return <StopIcon />;
  }

  if (Math.abs(apca) < conclusions['Non-Text']) {
    return <WarningIcon />;
  }

  if (Math.abs(apca) < conclusions['Large Text']) {
    return <PictureIcon />;
  }

  return (
    <div
      style={{
        color: `var(${ThemeVariablesKeys.fg})`,
      }}
      className="flex items-center"
    >
      <div className="mr-3 flex items-center">
        <p
          style={{
            borderColor: `var(${ThemeVariablesKeys.fg})`,
          }}
          className="mr-2 rounded border-0.5 p-1 text-xxxs font-medium leading-[8px]"
        >
          Rg
        </p>
        <p className="text-xxs leading-none">{regular}px</p>
      </div>
      <div className="flex items-center">
        <p
          style={{
            borderColor: `var(${ThemeVariablesKeys.fg})`,
          }}
          className="mr-2 rounded border-0.5 p-1 text-xxxs font-medium leading-[8px]"
        >
          Bd
        </p>
        <p className="text-xxs leading-none">{bold}px</p>
      </div>
    </div>
  );
};
