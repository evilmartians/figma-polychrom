<script lang="ts">
  import SegmentedFontStyleDefinition from '~ui/components/SegmentedFontStyleDefinition.svelte';
  import SelectionContent from '~ui/components/SelectionContent.svelte';
  import ThemeVariablesProvider from '~ui/components/ThemeVariablesProvider.svelte';
  import { type ContrastConclusion, ThemeVariablesKeys } from '~ui/types';
  import { isEmpty } from '~utils/not-empty.ts';

  import { generateUIColors } from '../services/theme/generate-ui-colors.ts';

  interface Props {
    id: string;
    isLast?: boolean;
    size: 'large' | 'small';
    userSelection: ContrastConclusion;
  }

  const SEGMENTED_FONT_STYLES = {
    INITIAL: 1,
    MAX: 2,
  };

  const { id, isLast, size, userSelection }: Props = $props();
  const { apca, bg, fg } = $derived(userSelection);

  let currentStyleNumber = $state(SEGMENTED_FONT_STYLES.INITIAL);

  const handleCurrentStyleNumberChange = (): void => {
    const newStyleNumber = currentStyleNumber + 1;
    if (newStyleNumber > SEGMENTED_FONT_STYLES.MAX) {
      currentStyleNumber = SEGMENTED_FONT_STYLES.INITIAL;
    } else {
      currentStyleNumber = newStyleNumber;
    }
  };

  const uiColors = $derived(
    generateUIColors(
      { hex: fg.hex, oklch: fg.oklch },
      { hex: bg.hex, oklch: bg.oklch }
    )
  );
</script>

{#if isEmpty(userSelection.apca) || isEmpty(uiColors)}
  <p
    class="mx-auto mb-4 flex select-none items-end justify-center py-4 text-center font-martianMono text-xxs text-secondary-75"
  >
    Can&apos;t calc
  </p>
{:else}
  <ThemeVariablesProvider theme={uiColors.theme}>
    <div
      class={[
        'w-full rounded-2.5xl',
        size === 'small' && isLast === false && 'px-5 pb-8 pt-2',
        size === 'small' && isLast === true && 'px-5 py-3',
        size === 'large' && 'p-5',
      ]}
      style:background-color="var({ThemeVariablesKeys.bg})"
      id={`selection-${id}`}
    >
      <SegmentedFontStyleDefinition
        {currentStyleNumber}
        {id}
        primaryColor={uiColors.theme.fg}
        secondaryColor={uiColors.theme.secondary}
      />

      <SelectionContent
        {apca}
        {bg}
        {fg}
        {id}
        {isLast}
        onApcaDoubleClick={handleCurrentStyleNumberChange}
        {size}
        --text-shadow-color={`var(${ThemeVariablesKeys.fg24})`}
      />
    </div>
  </ThemeVariablesProvider>
{/if}
