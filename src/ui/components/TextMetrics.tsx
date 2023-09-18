import { conclusions } from '~ui/services/apca/conclusion.ts';
import { fontLookupAPCA } from 'apca-w3';
import { type ReactElement } from 'react';

import { PictureIcon } from './PictureIcon.tsx';
import { StopIcon } from './StopIcon.tsx';
import { WarningIcon } from './WarningIcon.tsx';

interface Props {
  apca: number;
  color: string;
}

export const TextMetrics = ({ apca, color }: Props): ReactElement => {
  const [, , , , regular, , , bold] = fontLookupAPCA(apca);

  if (Math.abs(apca) < conclusions.Invisible) {
    return <StopIcon color={color} />;
  }

  if (Math.abs(apca) < conclusions['Non-Text']) {
    return <WarningIcon color={color} />;
  }

  if (Math.abs(apca) < conclusions['Large Text']) {
    return <PictureIcon color={color} />;
  }

  return (
    <div
      style={{
        color,
      }}
      className="flex items-center"
    >
      <div className="mr-3 flex items-center">
        <p
          style={{
            borderColor: color,
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
            borderColor: color,
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
