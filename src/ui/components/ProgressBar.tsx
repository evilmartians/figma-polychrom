import { useStore } from '@nanostores/solid';
import { RewardingAnimationBodyText } from '~ui/components/RewardingAnimationBodyText.tsx';
import { RewardingAnimationContentText } from '~ui/components/RewardingAnimationContentText.tsx';
import { RewardingAnimationFluentText } from '~ui/components/RewardingAnimationFluentText.tsx';
import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { conclusions } from '~ui/services/apca/conclusion.ts';
import { $rewardAnimationLaunch } from '~ui/stores/selected-nodes.ts';
import { isEmpty } from '~utils/not-empty.ts';
import { createMemo, For, type JSX, Show } from 'solid-js';

interface Props {
  apca: number;
  height: number;
}

const SCALE = 2;
const APCA_NEGATIVE_MAX_SCALE = 108;
const APCA_POSITIVE_MAX_SCALE = 106;
const SERIF_OFFSET = 2;

const conclusionScores = Object.values(conclusions).reverse().slice(1);

export const ProgressBar = (props: Props): JSX.Element => {
  const rewardAnimationLaunch = useStore($rewardAnimationLaunch);

  const maxScale = createMemo(() =>
    props.apca > 0 ? APCA_POSITIVE_MAX_SCALE : APCA_NEGATIVE_MAX_SCALE
  );
  const barWidth = createMemo(() => maxScale() * SCALE);
  const filledSegmentWidth = createMemo(() => Math.abs(props.apca) * SCALE);

  return (
    <div class="flex items-center justify-center">
      <div class="flex items-center">
        <span
          class="mr-2 text-xxs"
          style={{ color: `var(${ThemeVariablesKeys.secondary})` }}
        >
          0
        </span>

        <div
          style={{
            'background-color': `var(${ThemeVariablesKeys.secondary12})`,
            height: `${props.height}px`,
            width: `${barWidth()}px`,
          }}
          class="relative rounded-full"
        >
          <div
            style={{
              'background-image': `linear-gradient(to right, var(${ThemeVariablesKeys.fg70}) 70%, var(${ThemeVariablesKeys.fg}) 85%)`,
              height: `${props.height}px`,
              width: `${filledSegmentWidth()}px`,
            }}
            class="rounded-full"
          />

          <div>
            <For each={conclusionScores}>
              {(value) => {
                const isContextText = value === conclusions['Content Text'];
                const isBodyText = value === conclusions['Body Text'];
                const isFluentText = value === conclusions['Fluent Text'];

                if (isEmpty(value)) return null;

                const position = value * SCALE - SERIF_OFFSET;

                return (
                  <div
                    style={{
                      '--color-sparkles': `var(${ThemeVariablesKeys.fg})`,
                      'background-color': `var(${ThemeVariablesKeys.bg})`,
                      left: `${position}px`,
                    }}
                    class={`${isContextText ? 'h-1' : 'h-0.5'} absolute top-1/2 w-px -translate-y-1/2`}
                  >
                    <Show
                      when={Boolean(
                        isContextText && rewardAnimationLaunch().contentText
                      )}
                    >
                      <RewardingAnimationContentText />
                    </Show>
                    <Show
                      when={Boolean(
                        isBodyText && rewardAnimationLaunch().bodyText
                      )}
                    >
                      <RewardingAnimationBodyText />
                    </Show>
                    <Show
                      when={Boolean(
                        isFluentText && rewardAnimationLaunch().fluentText
                      )}
                    >
                      <RewardingAnimationFluentText />
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </div>

        <span
          class="ml-2 text-xxs"
          style={{ color: `var(${ThemeVariablesKeys.secondary})` }}
        >
          {maxScale()}
        </span>
      </div>
    </div>
  );
};
