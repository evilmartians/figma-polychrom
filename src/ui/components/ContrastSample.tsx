import clsx from 'clsx';
import { type ReactElement } from 'react';

interface Props {
  backgroundColor: string;
  borderColor?: string;
  color: string;
  size: 'large' | 'small';
}

export const ContrastSample = ({
  backgroundColor,
  borderColor,
  color,
  size,
}: Props): ReactElement => {
  return (
    <p
      className={clsx(
        size === 'small' ? 'h-9 w-9 text-xxs' : 'h-13 w-13 text-base',
        'flex items-center justify-center rounded-lg text-base',
        borderColor != null ? 'border-0.5' : null
      )}
      style={{
        backgroundColor,
        borderColor,
        color,
      }}
    >
      Aa
    </p>
  );
};
