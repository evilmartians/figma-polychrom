import { type FigmaPaint } from '~types/figma.ts';
import { getConclusionByScore } from '~ui/services/apca/conclusion.ts';
import clsx from 'clsx';
import { type ReactElement } from 'react';

import { type WidgetProps } from '../services/theme/generate-ui-colors.ts';
import { ColorIndicator } from './ColorIndicator.tsx';
import { ContrastSample } from './ContrastSample.tsx';
import { ProgressBar } from './ProgressBar.tsx';
import { TextMetrics } from './TextMetrics.tsx';

interface Props {
  apca: number;
  bgNodeFill: FigmaPaint;
  id: string;
  isLast?: boolean;
  selectedNodeFill: FigmaPaint;
  size: 'large' | 'small';
  uiColors: WidgetProps;
}

export const SelectionContent = ({
  apca,
  bgNodeFill,
  id,
  isLast,
  selectedNodeFill,
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
            color: uiColors.theme.foreground.hex,
          }}
          className="text-xxs"
        >
          {getConclusionByScore(Math.abs(apca))}
        </p>

        <TextMetrics apca={apca} color={uiColors.theme.foreground.hex} />
      </div>

      <div
        className={clsx(
          size === 'large' && 'mb-1',
          'flex w-full items-center justify-between'
        )}
      >
        <div className="shrink-0 grow">
          <ContrastSample
            backgroundColor={bgNodeFill.hex}
            borderColor={uiColors.theme.border?.hex}
            color={selectedNodeFill.hex}
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
            '--text-shadow-color': `${uiColors.theme.foreground.hex}3D`,
          }}
        >
          <h1 className="text-shadow">{Math.abs(apca)}</h1>
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
              height={size === 'small' ? 6 : 8}
              primaryColor={uiColors.theme.foreground.hex}
              secondaryColor={uiColors.theme.secondary.hex}
            />
          </div>
        )}

        {size === 'large' && (
          <div className="flex items-center justify-between text-xxs">
            <ColorIndicator
              color={uiColors.theme.foreground.hex}
              fill={selectedNodeFill}
              hoverBgColor={uiColors.theme.secondary.hex}
              indicatorColor={selectedNodeFill.hex}
            />

            <ColorIndicator
              borderColor={uiColors.theme.border?.hex}
              color={uiColors.theme.secondary.hex}
              fill={bgNodeFill}
              hoverBgColor={uiColors.theme.secondary.hex}
              indicatorColor={bgNodeFill.hex}
            />
          </div>
        )}
      </>
    </div>
  );
};
