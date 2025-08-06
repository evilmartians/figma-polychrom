import type { VNode } from 'preact';

import { type Placement } from '@floating-ui/dom';
import { useFloatingTooltip } from '~hooks/useFloatingTooltip.ts';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'preact/compat';

interface TooltipProps {
  children: VNode;
  content: string | VNode;
  placement?: Placement;
}

export const Tooltip = ({
  children,
  content,
  placement = 'top',
}: TooltipProps): VNode => {
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const openTimeout = useRef<null | number>(null);
  const closeTimeout = useRef<null | number>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const initTooltip = async (): Promise<void> => {
      if (visible && triggerRef.current != null && tooltipRef.current != null) {
        await useFloatingTooltip(
          triggerRef.current,
          tooltipRef.current,
          placement
        );
      }
    };

    void initTooltip().catch();
  }, [visible]);

  const onMouseEnter = (): void => {
    if (closeTimeout.current != null) clearTimeout(closeTimeout.current);
    openTimeout.current = window.setTimeout(() => {
      setVisible(true);
    }, 150);
  };

  const onMouseLeave = (): void => {
    if (openTimeout.current != null) clearTimeout(openTimeout.current);
    closeTimeout.current = window.setTimeout(() => {
      setVisible(false);
    }, 0);
  };

  const childWithRef = isValidElement(children)
    ? cloneElement(children, { ref: triggerRef })
    : children;

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {childWithRef}

      {visible && (
        <div
          className="absolute z-50 w-max rounded-full bg-black px-3 py-1.5 font-martianMono text-xxs font-medium text-white shadow-md transition-opacity dark:bg-white dark:text-black"
          ref={tooltipRef}
          style={{ left: 0, position: 'absolute', top: 0 }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
