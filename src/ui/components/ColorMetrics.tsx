import clsx from 'clsx';
import { type ReactElement } from 'react';

interface Props {
  label: string;
  labelColor: string;
  labelDirection: 'left' | 'right';
  labelPosition: 'bottom' | 'top';
  primary?: string;
  primaryColor: string;
  secondary?: string;
  secondaryColor: string;
  size: 'large' | 'small';
}

export const ColorMetrics = ({
  label,
  labelColor,
  labelDirection,
  labelPosition,
  primary,
  primaryColor,
  secondary,
  secondaryColor,
  size,
}: Props): ReactElement => (
  <div
    className={clsx(
      size === 'small' ? 'text-xxs' : 'text-base',
      size === 'small' ? 'font-normal' : 'font-extralight',
      labelDirection === 'right' ? 'ml-auto' : '',
      labelDirection === 'left' ? 'text-left' : 'text-right'
    )}
  >
    {labelPosition === 'top' && (
      <span
        style={{
          color: labelColor,
        }}
      >
        {label}
      </span>
    )}

    <div>
      {primary != null && (
        <>
          <span
            style={{
              color: primaryColor,
            }}
          >
            {primary}
          </span>{' '}
        </>
      )}

      {secondary != null && (
        <span
          style={{
            color: secondaryColor,
          }}
        >
          {secondary}
        </span>
      )}
    </div>

    {labelPosition === 'bottom' && (
      <span
        style={{
          color: labelColor,
        }}
      >
        {label}
      </span>
    )}
  </div>
);
