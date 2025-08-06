<script lang="ts">
  import { styleObjectToCssString } from '~ui/services/css/transformStyleObjectToString.ts';
  import { formatColorForTheme } from '~ui/services/format/format-color-for-theme.ts';
  import { type Theme } from '~ui/services/theme/generate-ui-colors.ts';
  import { ThemeVariablesKeys } from '~ui/types';
  import { type Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    theme: Theme;
  }

  const { children, theme }: Props = $props();

  const stylesString = $derived(() => {
    const styles = {
      [ThemeVariablesKeys.bg]: formatColorForTheme(theme.bg),
      [ThemeVariablesKeys.bgBorder]: formatColorForTheme(theme.bgBorder),
      [ThemeVariablesKeys.borderOriginal]: formatColorForTheme(
        theme.borderOriginal
      ),
      [ThemeVariablesKeys.fg]: formatColorForTheme(theme.fg),
      [ThemeVariablesKeys.fg24]: formatColorForTheme(theme.fg, 0.24),
      [ThemeVariablesKeys.fg70]: formatColorForTheme(theme.fg, 0.7),
      [ThemeVariablesKeys.fgBorder]: formatColorForTheme(theme.fgBorder),
      [ThemeVariablesKeys.secondary]: formatColorForTheme(theme.secondary),
      [ThemeVariablesKeys.secondary12]: formatColorForTheme(
        theme.secondary,
        0.12
      ),
      [ThemeVariablesKeys.secondary16]: formatColorForTheme(
        theme.secondary,
        0.16
      ),
      [ThemeVariablesKeys.secondary24]: formatColorForTheme(
        theme.secondary,
        0.24
      ),
    };

    return styleObjectToCssString(styles);
  });
</script>

<div class="w-full" style={stylesString()}>
  {@render children()}
</div>
