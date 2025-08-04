import { type UIColor } from '~types/common.ts';
import { isSupportsOKLCH } from '~ui/constants.ts';
import { type Theme } from '~ui/services/theme/generate-ui-colors.ts';
import { formatForOklchCSS } from '~utils/colors/formatters.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { formatHex8 } from 'culori/fn';
import { createMemo, type JSX } from 'solid-js';

interface Props {
  children: JSX.Element;
  theme: Theme;
}

const prefix = '--polychrom-theme-';

export enum ThemeVariablesKeys {
  bg = `${prefix}bg`,
  bgBorder = `${prefix}bg-border`,
  borderOriginal = `${prefix}border-original`,
  fg = `${prefix}fg`,
  fg24 = `${prefix}fg-24`,
  fg70 = `${prefix}fg-70`,
  fgBorder = `${prefix}fg-border`,
  secondary = `${prefix}secondary`,
  secondary12 = `${prefix}secondary-12`,
  secondary16 = `${prefix}secondary-16`,
  secondary24 = `${prefix}secondary-24`,
}

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

export const ThemeVariablesProvider = (props: Props): JSX.Element => {
  const styles = createMemo(() => {
    const { bg, bgBorder, borderOriginal, fg, fgBorder, secondary } = props.theme;
    return {
      [ThemeVariablesKeys.bg]: formatColorForTheme(bg),
      [ThemeVariablesKeys.bgBorder]: formatColorForTheme(bgBorder),
      [ThemeVariablesKeys.borderOriginal]: formatColorForTheme(borderOriginal),
      [ThemeVariablesKeys.fg]: formatColorForTheme(fg),
      [ThemeVariablesKeys.fg24]: formatColorForTheme(fg, 0.24),
      [ThemeVariablesKeys.fg70]: formatColorForTheme(fg, 0.7),
      [ThemeVariablesKeys.fgBorder]: formatColorForTheme(fgBorder),
      [ThemeVariablesKeys.secondary]: formatColorForTheme(secondary),
      [ThemeVariablesKeys.secondary12]: formatColorForTheme(secondary, 0.12),
      [ThemeVariablesKeys.secondary16]: formatColorForTheme(secondary, 0.16),
      [ThemeVariablesKeys.secondary24]: formatColorForTheme(secondary, 0.24),
    };
  });

  return (
    <div class="w-full" style={styles()}>
      {props.children}
    </div>
  );
};
