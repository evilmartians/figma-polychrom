import {
  formatColorForTheme,
  ThemeVariablesKeys,
} from '~ui/components/ThemeVariablesProvider.tsx';
import { getConclusionByScore } from '~ui/services/apca/conclusion.ts';
import { type ContrastConclusion } from '~ui/types';
import clsx from 'clsx';
import { type ReactElement } from 'react';

import { ColorIndicator } from './ColorIndicator.tsx';
import { ContrastSample } from './ContrastSample.tsx';
import { ProgressBar } from './ProgressBar.tsx';
import { TextMetrics } from './TextMetrics.tsx';

interface Props extends ContrastConclusion {
  isLast?: boolean;
  onApcaDoubleClick: () => void;
  size: 'large' | 'small';
}

export const SelectionContent = ({
  apca,
  bg,
  fg,
  id,
  isLast,
  onApcaDoubleClick,
  size,
}: Props): ReactElement => {
  const bgColor = formatColorForTheme(bg);
  const fgColor = formatColorForTheme(fg);

  return (
    <div className="relative grid h-full w-full">
      <div
        className={clsx(
          size === 'small' ? 'mb-1' : 'mb-5',
          'flex items-center justify-between'
        )}
      >
        <p
          style={{
            color: `var(${ThemeVariablesKeys.fg})`,
          }}
          className="text-xxs"
        >
          {getConclusionByScore(Math.abs(apca))}
        </p>

        <div className="flex h-[18px] items-center">
          <TextMetrics apca={apca} />
        </div>
      </div>

      <div
        className={clsx(
          size === 'large' && 'mb-1',
          'flex w-full items-center justify-between'
        )}
      >
        <div className="shrink-0 grow">
          <ContrastSample bgColor={bgColor} color={fgColor} size={size} />
        </div>

        <div
          className={clsx(
            size === 'small' ? 'mr-9 text-5xl' : 'mr-13 text-7xl',
            `segmented-${id} w-full text-center leading-none text-shadow`
          )}
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            '--text-shadow-color': `var(${ThemeVariablesKeys.fg24})`,
          }}
        >
          <h1 className="inline text-shadow" onDoubleClick={onApcaDoubleClick}>
            {Math.abs(apca)}
          </h1>
        </div>
      </div>

      <>
        {(isLast === true || size === 'large') && (
          <div
            className={
              isLast === true && size === 'small' ? 'mb-0 mt-1' : 'mb-5'
            }
          >
            <ProgressBar apca={apca} height={size === 'small' ? 6 : 8} />
          </div>
        )}

        {size === 'large' && (
          <div className="flex items-center justify-between text-xxs">
            <ColorIndicator
              borderColor={ThemeVariablesKeys.fgBorder}
              fill={fg}
              indicatorColor={fgColor}
              isBlended={fg.isBlended}
              textColor={ThemeVariablesKeys.fg}
            />

            <ColorIndicator
              borderColor={ThemeVariablesKeys.bgBorder}
              fill={bg}
              indicatorColor={bgColor}
              isBlended={bg.isBlended}
              textColor={ThemeVariablesKeys.secondary}
            />
          </div>
        )}
      </>
    </div>
  );
};
