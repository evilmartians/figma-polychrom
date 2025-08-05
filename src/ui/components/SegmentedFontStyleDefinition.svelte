<script lang="ts">
  import type { UIColor } from '~types/common.ts';

  import { isSupportsOKLCH } from '~ui/constants.ts';
  import { formatForOklchCSS } from '~utils/colors/formatters.ts';
  import { isEmpty, notEmpty } from '~utils/not-empty.ts';
  import { formatHex8 } from 'culori/fn';

  const { currentStyleNumber, id, primaryColor, secondaryColor } = $props<{
    currentStyleNumber: number;
    id: string;
    primaryColor: UIColor;
    secondaryColor: UIColor;
  }>();

  export const formatColorForTheme = (
    color: null | UIColor,
    alpha?: number
  ): string => {
    if (isEmpty(color)) {
      return '';
    }

    if (isSupportsOKLCH) {
      return formatForOklchCSS(color.oklch, alpha);
    }

    return notEmpty(alpha) ? formatHex8({ ...color.oklch, alpha }) : color.hex;
  };

  const formattedCurrentStyleNumber = $derived(
    currentStyleNumber.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  );

  const primaryFormatted = $derived(formatColorForTheme(primaryColor));
  const secondaryFormatted = $derived(
    formatColorForTheme(secondaryColor, 0.12)
  );

  const styleContent = $derived(`
    @font-palette-values --segmented-${id} {
      font-family: Segmented;
      override-colors: 0 ${primaryFormatted}, 1 ${secondaryFormatted};
    }

    .segmented-${id} {
      font-family: Segmented;
      font-palette: --segmented-${id};
      font-feature-settings: 'ss${formattedCurrentStyleNumber}' on;
      font-variation-settings: 'wght' 600, 'wdth' 100, 'slnt' 5;
    }
  `);

  $effect(() => {
    const styleEl = document.getElementById(`style-for-${id}`);
    if (styleEl !== null) {
      styleEl.textContent = styleContent;
    }
  });
</script>

<svelte:head>
  <style id="style-for-{id}"></style>
</svelte:head>
