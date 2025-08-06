import {
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
} from '@floating-ui/dom';

export const useFloatingTooltip = async (
  trigger: HTMLElement,
  tooltip: HTMLElement,
  placement: Placement = 'top'
): Promise<void> => {
  const { x, y } = await computePosition(trigger, tooltip, {
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
    placement,
  });

  Object.assign(tooltip.style, {
    left: `${x}px`,
    top: `${y}px`,
  });
};
