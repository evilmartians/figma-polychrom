<script lang="ts">
  import ColorPreview from '~ui/components/ColorPreview.svelte';
  import { copy } from '~ui/services/use-copy-to-clipboard/useCopyToClipboard.ts';
  import {
    getFormatterForCSS,
    getFormatterForDisplaying,
  } from '~utils/colors/formatters.ts';
  import { type Oklch } from 'culori/fn';

  import { colorSpaceDisplayMode } from '../stores/color-space-display-mode.ts';
  import Tooltip from './Tooltip.svelte';

  interface ColorIndicatorProps {
    borderColor: string;
    fill: { hex: string; oklch: Oklch };
    indicatorColor: string;
    isBlended: boolean;
    textColor: string;
  }

  const {
    borderColor,
    fill,
    indicatorColor,
    isBlended,
    textColor,
  }: ColorIndicatorProps = $props();

  const formatColorForDisplay = $derived(
    getFormatterForDisplaying($colorSpaceDisplayMode)
  );
  const displayValue = $derived(formatColorForDisplay(fill.oklch));

  const formatColorForCSS = getFormatterForCSS($colorSpaceDisplayMode);
  const cssValue = formatColorForCSS(fill.oklch);
  let copied = $state('');
  const onCopy = (): void => {
    copied = cssValue;
    setTimeout(() => {
      copied = '';
    }, 2000);
  }
</script>

<Tooltip>
  {#snippet trigger()}
      <button
        style:color="{indicatorColor}"
        class="interactive"
        type="button"
        use:copy
        oncopied={onCopy}
      >
        <div
          class="flex items-center rounded-[7px] p-1 hover:bg-indicatorsHover active:bg-indicatorsActive"
        >
          <div class="mr-2">
            <ColorPreview {borderColor} {indicatorColor} {isBlended} />
          </div>
          <span style:color="var({textColor})">{displayValue}</span>
        </div>
      </button>
  {/snippet}

  {#if copied}
    Copied!
  {:else}
    <span class="whitespace-nowrap">Copy as CSS</span>
  {/if}
</Tooltip>
