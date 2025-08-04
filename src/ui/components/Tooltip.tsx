import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type {
  TooltipContentProps,
  TooltipRootProps,
} from '@kobalte/core/tooltip';

import { Tooltip as TooltipPrimitive } from '@kobalte/core/tooltip';
import { type JSX, mergeProps, splitProps, type ValidComponent } from 'solid-js';

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const Tooltip = (props: TooltipRootProps): JSX.Element => {
  const merge = mergeProps<TooltipRootProps[]>(
    {
      closeDelay: 0.5,
      defaultOpen: false,
      flip: true,
      gutter: 5,
      ignoreSafeArea: false,
      // eslint-disable-next-line solid/reactivity
      onOpenChange: props.onOpenChange,
      // eslint-disable-next-line solid/reactivity
      open: props.open,
      openDelay: 0.5,
      placement: 'top'
    },
    props,
  );

  return <TooltipPrimitive {...merge} />;
};

type tooltipContentProps<T extends ValidComponent = 'div'> =
  TooltipContentProps<T> & {
  class?: string;
};

export const TooltipContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, tooltipContentProps<T>>,
): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, rest] = splitProps(props as tooltipContentProps, ['class']);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        class='rounded-full bg-black p-2 px-3 py-1.5 font-martianMono text-xxs font-medium text-white shadow-md transition-opacity dark:bg-white dark:text-black'
        {...rest}
      />
    </TooltipPrimitive.Portal>
  );
};
