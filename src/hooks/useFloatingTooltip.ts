import {
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
} from '@floating-ui/dom';

export function useFloatingTooltip(
  trigger: HTMLElement,
  tooltip: HTMLElement,
  placement: Placement = 'top'
) {
  tooltip.style.position = 'absolute';

  computePosition(trigger, tooltip, {
    placement,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  }).then(({ x, y }) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
}
