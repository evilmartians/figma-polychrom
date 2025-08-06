import { type Placement } from '@floating-ui/dom';
import { useFloatingTooltip } from '~hooks/useFloatingTooltip.ts';
import { type ComponentChildren, type VNode } from 'preact';
import { useEffect, useRef, useState } from 'preact/compat';

interface TooltipProps {
  children: ComponentChildren;
  content: ComponentChildren;
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
    if (visible && triggerRef.current != null && tooltipRef.current != null) {
      useFloatingTooltip(triggerRef.current, tooltipRef.current, placement);
    }
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

  return (
    <div
      className={`relative`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      {visible && (
        <div
          style={{
            left: 0,
            top: 0,
          }}
          className="absolute z-50 w-max rounded-full bg-black p-2 px-3 py-1.5 font-martianMono text-xxs font-medium text-white shadow-md transition-opacity dark:bg-white dark:text-black"
          ref={tooltipRef}
        >
          {content}
        </div>
      )}
    </div>
  );
};
