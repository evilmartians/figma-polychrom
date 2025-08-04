import { useStore } from '@nanostores/solid';
import { ColorPreview } from '~ui/components/ColorPreview.tsx';
import { ThemeVariablesKeys } from '~ui/components/ThemeVariablesProvider.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '~ui/components/Tooltip.tsx';
import {
  getFormatterForCSS,
  getFormatterForDisplaying,
} from '~utils/colors/formatters.ts';
import copy from 'copy-to-clipboard';
import { type Oklch } from 'culori/fn';
import { createMemo, createSignal, type JSX } from 'solid-js';

import { $colorSpaceDisplayMode } from '../stores/color-space-display-mode.ts';

interface ColorIndicatorProps {
  borderColor: string;
  fill: { hex: string; oklch: Oklch };
  id: string;
  indicatorColor: string;
  isBlended: boolean;
  textColor: string;
}

export const ColorIndicator = (props: ColorIndicatorProps): JSX.Element => {
  const colorSpaceDisplayMode = useStore($colorSpaceDisplayMode);

  const [isOpen, setIsOpen] = createSignal(false);
  const [isCopied, setIsCopied] = createSignal(false);
  const [eventType, setEventType] = createSignal<'click' | 'pointerenter' | 'pointerleave'>('pointerenter');

  const formatColorForDisplay = createMemo(() => getFormatterForDisplaying(colorSpaceDisplayMode()));
  const displayValue = createMemo(() => formatColorForDisplay()(props.fill.oklch));

  const formatColorForCSS = createMemo(() => getFormatterForCSS(colorSpaceDisplayMode()));
  const cssValue = createMemo(() => formatColorForCSS()(props.fill.oklch));

  const handleCopy = (): void => {
    const result = copy(cssValue());
    setIsCopied(result);
  };

  const handleCustomOpen = (openState: boolean): void => {
    if (eventType() === 'click' && !openState) {
      setIsOpen(true);
    }

    if (eventType() === 'pointerleave') {
      setIsCopied(false);
      setIsOpen(false);
    }

    if (eventType() === 'pointerenter') {
      setIsOpen(true);
    }
  };

  const handleChangeEventType = (eventType: 'click' | 'pointerenter' | 'pointerleave') => (): void => {
    setEventType(eventType);
  };

  return (
    <Tooltip id={props.id} onOpenChange={handleCustomOpen} open={isOpen()}>
      <TooltipTrigger
        onClick={handleChangeEventType('click')}
        onPointerEnter={handleChangeEventType('pointerenter')}
        onPointerLeave={handleChangeEventType('pointerleave')}>
        <button
          style={{
            '--indicators-active': `var(${ThemeVariablesKeys.secondary24})`,
            '--indicators-hover': `var(${ThemeVariablesKeys.secondary16})`,
            color: props.indicatorColor,
          }}
          class="interactive"
          onClick={handleCopy}
          type="button"
        >
          <div class="flex items-center rounded-[7px] p-1 hover:bg-indicatorsHover active:bg-indicatorsActive">
            <div class="mr-2">
              <ColorPreview
                borderColor={props.borderColor}
                indicatorColor={props.indicatorColor}
                isBlended={props.isBlended}
              />
            </div>
            <span style={{ color: `var(${props.textColor})` }}>{displayValue()}</span>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent>{isCopied() ? 'Copied!' : 'Copy as CSS'}</TooltipContent>
    </Tooltip>
  );
};
