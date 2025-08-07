import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import clsx from 'clsx';
import { type JSX } from 'preact';

interface Props {
  bgColor: string;
  color: string;
  opacity?: number;
  size: 'large' | 'small';
}

const exampleText = 'Aa';

export const ContrastSample = ({
  bgColor,
  color,
  opacity,
  size,
}: Props): JSX.Element => (
  <p
    className={clsx(
      size === 'small' ? 'size-9 text-xxs' : 'h-13 w-13 text-base',
      'flex items-center justify-center rounded-lg border-0.5 text-base'
    )}
    style={{
      backgroundColor: bgColor,
      borderColor: `var(${ThemeVariablesKeys.borderOriginal})`,
      color,
    }}
  >
    <span
      style={{
        opacity,
      }}
    >
      {exampleText}
    </span>
  </p>
);
