import { notEmpty } from '~utils/not-empty.ts';
import { type ReactElement } from 'react';

interface Props {
  borderColor?: string;
  indicatorColor: string;
}

export const ColorPreview = ({
  borderColor,
  indicatorColor,
}: Props): ReactElement => {
  return (
    <div
      style={{
        backgroundColor: indicatorColor,
        ...(notEmpty(borderColor) && {
          borderColor,
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }),
      }}
      className={`mr-2 h-4 w-4 rounded`}
    />
  );
};
