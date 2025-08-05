import {
  formatColorForTheme,
  ThemeVariablesKeys,
} from '~ui/components/ThemeVariablesProvider.tsx';
import { getConclusionByScore } from '~ui/services/apca/conclusion.ts';
import { type ContrastConclusion } from '~ui/types';
import { createMemo, type JSX, Show } from 'solid-js';

import { ColorIndicator } from './ColorIndicator.tsx';
import { ContrastSample } from './ContrastSample.tsx';
import { ProgressBar } from './ProgressBar.tsx';
import { TextMetrics } from './TextMetrics.tsx';

interface Props extends ContrastConclusion {
  isLast?: boolean;
  onApcaDoubleClick: () => void;
  size: 'large' | 'small';
}

export const SelectionContent = (props: Props): JSX.Element => {
  const bgColor = createMemo(() => formatColorForTheme(props.bg));
  const fgColor = createMemo(() => formatColorForTheme(props.fg));

  const handleDoubleClick = (): void => {
    props.onApcaDoubleClick();
  };

  return (
    <div class="relative grid size-full">
      <div
        class={`${props.size === 'small' ? 'mb-1' : 'mb-5'} flex items-center justify-between`}
      >
        <p class="text-xxs" style={{ color: `var(${ThemeVariablesKeys.fg})` }}>
          {getConclusionByScore(Math.abs(props.apca))}
        </p>

        <div class="flex h-[18px] items-center">
          <TextMetrics apca={props.apca} />
        </div>
      </div>

      <div
        class={`${props.size === 'large' ? 'mb-1' : ''} flex w-full items-center justify-between`}
      >
        <div class="shrink-0 grow">
          <ContrastSample
            bgColor={bgColor()}
            color={fgColor()}
            size={props.size}
          />
        </div>

        <div
          style={{
            '--text-shadow-color': `var(${ThemeVariablesKeys.fg24})`,
          }}
          class={`${props.size === 'small' ? 'mr-9 text-5xl' : 'mr-13 text-7xl'} segmented-${props.id} w-full text-center leading-none text-shadow`}
        >
          <h1 class="inline text-shadow" onDblClick={handleDoubleClick}>
            {Math.abs(props.apca)}
          </h1>
        </div>
      </div>

      <div>
        <Show when={props.isLast === true || props.size === 'large'}>
          <div
            class={
              props.isLast === true && props.size === 'small'
                ? 'mb-0 mt-1'
                : 'mb-5'
            }
          >
            <ProgressBar
              apca={props.apca}
              height={props.size === 'small' ? 6 : 8}
            />
          </div>
        </Show>

        <Show when={props.size === 'large'}>
          <div class="flex items-center justify-between text-xxs">
            <ColorIndicator
              borderColor={ThemeVariablesKeys.fgBorder}
              fill={props.fg}
              id="fg"
              indicatorColor={fgColor()}
              isBlended={props.fg.isBlended}
              textColor={ThemeVariablesKeys.fg}
            />

            <ColorIndicator
              borderColor={ThemeVariablesKeys.bgBorder}
              fill={props.bg}
              id="bg"
              indicatorColor={bgColor()}
              isBlended={props.bg.isBlended}
              textColor={ThemeVariablesKeys.secondary}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
