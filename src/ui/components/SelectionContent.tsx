import { getConclusionByScore } from '~ui/services/apca/conclusion.ts';
import { type ContrastConclusion } from '~ui/services/colors/render-and-blend-colors.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

import { type WidgetProps } from '../services/theme/generate-ui-colors.ts';
import { ColorIndicator } from './ColorIndicator.tsx';
import { ContrastSample } from './ContrastSample.tsx';
import { ProgressBar } from './ProgressBar.tsx';
import { TextMetrics } from './TextMetrics.tsx';

interface Props extends ContrastConclusion {
  isLast?: boolean;
  onApcaDoubleClick: () => void;
  size: 'large' | 'small';
  uiColors: WidgetProps;
}

export const SelectionContent = ({
  apca,
  bg,
  fg,
  id,
  isLast,
  onApcaDoubleClick,
  size,
  uiColors,
}: Props): ReactElement => {
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
            color: uiColors.theme.fg.hex,
          }}
          className="text-xxs"
        >
          {getConclusionByScore(Math.abs(apca))}
        </p>

        <div className="flex h-[18px] items-center">
          <TextMetrics apca={apca} color={uiColors.theme.fg.hex} />
        </div>
      </div>

      <div
        className={clsx(
          size === 'large' && 'mb-1',
          'flex w-full items-center justify-between'
        )}
      >
        <div className="shrink-0 grow">
          <ContrastSample
            bgColor={bg.hex}
            borderColor={uiColors.theme.borderOriginal?.hex}
            color={fg.hex}
            size={size}
          />
        </div>

        <div
          className={clsx(
            size === 'small' ? 'mr-9 text-5xl' : 'mr-13 text-7xl',
            `segmented-${id} w-full text-center leading-none text-shadow`
          )}
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            '--text-shadow-color': `${uiColors.theme.fg.hex}3D`,
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
            <ProgressBar
              apca={apca}
              bgColor={uiColors.theme.bg.hex}
              height={size === 'small' ? 6 : 8}
              primaryColor={uiColors.theme.fg.hex}
              secondaryColor={uiColors.theme.secondary.hex}
            />
          </div>
        )}

        {size === 'large' && (
          <div className="flex items-center justify-between text-xxs">
            <ColorIndicator
              borderColor={uiColors.theme.fgBorder?.hex}
              fill={fg}
              hoverBgColor={uiColors.theme.secondary.hex}
              indicatorColor={fg.hex}
              isBlended={fg.isBlended}
              textColor={uiColors.theme.fg.hex}
            />

            <ColorIndicator
              borderColor={uiColors.theme.bgBorder?.hex}
              fill={bg}
              hoverBgColor={uiColors.theme.secondary.hex}
              indicatorColor={bg.hex}
              isBlended={bg.isBlended}
              textColor={uiColors.theme.secondary.hex}
            />
          </div>
        )}
      </>
    </div>
  );
};
