import { useRef, useEffect, useState } from 'preact/compat';
import { useFloatingTooltip } from '~hooks/useFloatingTooltip.ts';
import { Placement } from '@floating-ui/dom';
import { ComponentChildren } from 'preact';

interface TooltipProps {
  children: ComponentChildren;
  content: ComponentChildren;
  placement?: Placement;
}

export const Tooltip = ({
  children,
  content,
  placement = 'top',
}: TooltipProps) => {
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openTimeout = useRef<number | null>(null);
  const closeTimeout = useRef<number | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      return useFloatingTooltip(
        triggerRef.current,
        tooltipRef.current,
        placement
      );
    }
  }, [visible]);

  const onMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    openTimeout.current = window.setTimeout(() => setVisible(true), 150);
  };

  const onMouseLeave = () => {
    if (openTimeout.current) clearTimeout(openTimeout.current);
    closeTimeout.current = window.setTimeout(() => setVisible(false), 0);
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
            top: 0,
            left: 0,
          }}
          ref={tooltipRef}
          className="absolute z-50 w-max rounded-full bg-black p-2 px-3 py-1.5 font-martianMono text-xxs font-medium text-white shadow-md transition-opacity dark:bg-white dark:text-black"
        >
          {content}
        </div>
      )}
    </div>
  );
};
