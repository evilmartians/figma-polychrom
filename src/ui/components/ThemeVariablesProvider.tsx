import { type UIColor } from '~types/common.ts';
import { isSupportsOKLCH } from '~ui/constants.ts';
import { type Theme } from '~ui/services/theme/generate-ui-colors.ts';
import { formatForOklchCSS } from '~utils/colors/formatters.ts';
import { isEmpty, notEmpty } from '~utils/not-empty.ts';
import { formatHex8 } from 'culori';
import { type ReactElement } from 'react';

interface Props {
  children: ReactElement;
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

export const ThemeVariablesProvider = ({
  children,
  theme,
}: Props): ReactElement => {
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

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <div className="w-full" style={styles}>
      {children}
    </div>
  );
};
