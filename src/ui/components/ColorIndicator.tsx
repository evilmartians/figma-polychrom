import { useStore } from '@nanostores/react';
import { type ReactElement } from 'react';
import useClipboard from 'react-use-clipboard';

import { type FigmaPaint } from '../../types/figma.ts';
import { notEmpty } from '../../utils/not-empty.ts';
import { $colorSpaceDisplayMode } from '../stores/color-space-display-mode.ts';
import {
  getFormatForCSSFunction,
  getFormatForDisplayFunction,
} from './ColorFormatHelpers.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip.tsx';

interface IndicatorProps {
  borderColor?: string;
  indicatorColor: string;
}

const Indicator = ({
  borderColor,
  indicatorColor,
}: IndicatorProps): ReactElement => {
  return (
    <div
      style={{
        backgroundColor: indicatorColor,
        ...(notEmpty(borderColor) && {
          borderColor,
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }),
      }}
      className={`mr-2 h-4 w-4 rounded`}
    />
  );
};

interface ColorIndicatorProps {
  borderColor?: string;
  color: string;
  fill: FigmaPaint;
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

  const formatColorForDisplay = getFormatForDisplayFunction(
    colorSpaceDisplayMode
  );
  const displayValue = formatColorForDisplay(fill.oklch);

  const formatColorForCSS = getFormatForCSSFunction(colorSpaceDisplayMode);
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
            <Indicator
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
