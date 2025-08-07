import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
} from '@floating-ui/dom';
import {
  Component,
  type ComponentChildren,
  Fragment,
  type VNode,
} from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

interface TooltipProps {
  children: ComponentChildren;
  className?: string;
  content: ComponentChildren;
  delay?: number;
  placement?: Placement;
  style?: 'dark' | 'light';
  trigger?: 'click' | 'hover' | 'none';
}

type PreactComponent = { base: HTMLElement } & Component;

class RefWrapper extends Component<{ children: ComponentChildren; ref: any }> {
  render(): ComponentChildren {
    return this.props.children;
  }
}

export const Tooltip = ({
  children,
  className = '',
  content,
  delay = 150,
  placement = 'top',
  trigger = 'hover',
}: TooltipProps): VNode => {
  const reference = useRef<PreactComponent>(null);
  const floating = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const st = useRef<null | number>(null);

  const refCurrent = reference.current;
  const floatingCurrent = floating.current;
  /* ── position ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (
      refCurrent === null ||
      floatingCurrent === null ||
      refCurrent.base === null
    )
      return;

    return autoUpdate(refCurrent.base, floatingCurrent, () => {
      void computePosition(refCurrent.base, floatingCurrent, {
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
        Object.assign(floatingCurrent.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  }, [placement, visible]);

  /* ── trigger wiring ───────────────────────────────────────────────── */
  useEffect(() => {
    const refEl = reference.current?.base;
    const floatEl = floating.current;
    if (refEl == null || floatEl == null) return;

    /* helpers */
    const clear = (): void => {
      if (st.current != null) clearTimeout(st.current);
    };
    const show = (): void => {
      clear();
      st.current = setTimeout(() => {
        setVisible(true);
      }, delay);
    };
    const hide = (): void => {
      clear();
      setVisible(false);
    };

    /* attach based on *current* trigger prop */
    if (trigger === 'hover') {
      refEl.addEventListener('mouseenter', show);
      refEl.addEventListener('mouseleave', hide);
      floatEl.addEventListener('mouseenter', show);
      floatEl.addEventListener('mouseleave', hide);
    }
    /* "none" ⇒ nothing attached */

    if (trigger === 'none') {
      /* cancel any pending timers */
      if (st.current != null) clearTimeout(st.current);
      /* instantly hide bubble */
      setVisible(false);
    }

    /* detach when `trigger` changes or component unmounts */
    return () => {
      clear();
      if (trigger === 'hover') {
        refEl.removeEventListener('mouseenter', show);
        refEl.removeEventListener('mouseleave', hide);
        floatEl.removeEventListener('mouseenter', show);
        floatEl.removeEventListener('mouseleave', hide);
      }
    };
  }, [trigger, delay]);

  /* ── render ───────────────────────────────────────────────────────── */
  return (
    <Fragment>
      <div
        className={`absolute z-50 w-max rounded-full bg-black px-3 py-1.5 font-martianMono text-xxs font-medium text-white 
        shadow-md transition-opacity dark:bg-white dark:text-black ${visible ? 'opacity-100' : 'opacity-0'} ${className} `}
        ref={floating}
        role="tooltip"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        {content}
      </div>
      <RefWrapper ref={reference}>{children}</RefWrapper>
    </Fragment>
  );
};
