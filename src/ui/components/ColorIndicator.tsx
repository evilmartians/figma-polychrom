import { useStore } from '@nanostores/preact';
import { ColorPreview } from '~ui/components/ColorPreview.tsx';
import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { Tooltip } from '~ui/components/Tooltip.tsx';
import {
  getFormatterForCSS,
  getFormatterForDisplaying,
} from '~utils/colors/formatters.ts';
import { useClipboard } from '~utils/use-clickboard.ts';
import { type Oklch } from 'culori/fn';
import { type JSX } from 'preact';

import { $colorSpaceDisplayMode } from '../stores/color-space-display-mode.ts';

interface ColorIndicatorProps {
  borderColor: string;
  fill: { hex: string; oklch: Oklch };
  indicatorColor: string;
  isBlended: boolean;
  textColor: string;
}

export const ColorIndicator = ({
  borderColor,
  fill,
  indicatorColor,
  isBlended,
  textColor,
}: ColorIndicatorProps): JSX.Element => {
  const colorSpaceDisplayMode = useStore($colorSpaceDisplayMode);

  const formatColorForDisplay = getFormatterForDisplaying(
    colorSpaceDisplayMode
  );
  const displayValue = formatColorForDisplay(fill.oklch);

  const formatColorForCSS = getFormatterForCSS(colorSpaceDisplayMode);
  const cssValue = formatColorForCSS(fill.oklch);

  const [isCopied, setCopied] = useClipboard(cssValue, {
    successDuration: 2000,
  });

  return (
    <Tooltip content={isCopied ? 'Copied!' : 'Copy as CSS'}>
      <button
        style={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          '--indicators-active': `var(${ThemeVariablesKeys.secondary24})`,
          '--indicators-hover': `var(${ThemeVariablesKeys.secondary16})`,
          color: indicatorColor,
        }}
        className="interactive"
        onClick={setCopied}
        type="button"
      >
        <div className="flex items-center rounded-[7px] p-1 hover:bg-indicatorsHover active:bg-indicatorsActive">
          <div className="mr-2">
            <ColorPreview
              borderColor={borderColor}
              indicatorColor={indicatorColor}
              isBlended={isBlended}
            />
          </div>
          <span style={{ color: `var(${textColor})` }}>{displayValue}</span>
        </div>
      </button>
    </Tooltip>
  );
};
