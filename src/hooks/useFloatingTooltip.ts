import {
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
} from '@floating-ui/dom';

export const useFloatingTooltip = (
  trigger: HTMLElement,
  tooltip: HTMLElement,
  placement: Placement = 'top'
): void => {
  tooltip.style.position = 'absolute';

  void computePosition(trigger, tooltip, {
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
  }).then(({ x, y }) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};
