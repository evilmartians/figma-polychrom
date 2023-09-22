import { notEmpty } from '~utils/not-empty.ts';
import { type ReactElement } from 'react';

interface Props {
  borderColor?: string;
  indicatorColor: string;
  indicatorOpacity?: number;
}

export const ColorPreview = ({
  borderColor,
  indicatorColor,
  indicatorOpacity,
}: Props): ReactElement => {
  return (
    <div
      style={{
        backgroundColor: indicatorColor,
        opacity: indicatorOpacity,
        ...(notEmpty(borderColor) && {
          borderColor,
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }),
      }}
      className={`mr-2 h-4 w-4 shrink-0 grow rounded`}
    />
  );
};
