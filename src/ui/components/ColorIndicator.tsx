import { useStore } from '@nanostores/react';
import { ColorPreview } from '~ui/components/ColorPreview.tsx';
import {
  getFormatterForCSS,
  getFormatterForDisplaying,
} from '~utils/colors/formatters.ts';
import { type Oklch } from 'culori/fn';
import { type ReactElement } from 'react';
import useClipboard from 'react-use-clipboard';

import { $colorSpaceDisplayMode } from '../stores/color-space-display-mode.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip.tsx';

interface ColorIndicatorProps {
  borderColor?: string;
  color: string;
  fill: { hex: string; oklch: Oklch };
  hoverBgColor: string;
  indicatorColor: string;
}

export const ColorIndicator = ({
  borderColor,
  color,
  fill,
  hoverBgColor,
  indicatorColor,
}: ColorIndicatorProps): ReactElement => {
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
    <Tooltip>
      <TooltipTrigger>
        <button
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            '--indicators-active': `${hoverBgColor}3D`,
            '--indicators-hover': `${hoverBgColor}28`,
            color,
          }}
          className="interactive"
          onClick={setCopied}
          type="button"
        >
          <div className="flex items-center rounded-md p-0.5 hover:bg-indicatorsHover active:bg-indicatorsActive">
            <ColorPreview
              borderColor={borderColor}
              indicatorColor={indicatorColor}
            />
            <span style={{ color }}>{displayValue}</span>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent>{isCopied ? 'Copied!' : 'Copy as CSS'}</TooltipContent>
    </Tooltip>
  );
};
