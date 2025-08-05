import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { isEmpty } from '~utils/not-empty.ts';
import {
  cloneElement,
  createContext,
  forwardRef,
  type HTMLProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

interface TooltipOptions {
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?: Placement;
}

interface TooltipContextType {
  floatingStyles: HTMLProps<HTMLElement>['style'];
  getFloatingProps: (
    props?: HTMLProps<HTMLDivElement>
  ) => HTMLProps<HTMLDivElement>;
  getReferenceProps: (
    props?: HTMLProps<HTMLButtonElement>
  ) => HTMLProps<HTMLButtonElement>;
  open: boolean;
  refs: {
    setFloating: (node: HTMLElement | null) => void;
    setReference: (node: HTMLElement | null) => void;
  };
  setOpen: (open: boolean) => void;
}

export const useTooltip = ({
  initialOpen = false,
  onOpenChange: setControlledOpen,
  open: controlledOpen,
  placement = 'top',
}: TooltipOptions = {}): TooltipContextType => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
    onOpenChange: setOpen,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const context = data.context;

  const hover = useHover(context, {
    delay: {
      close: 0,
      open: 150,
    },
    enabled: isEmpty(controlledOpen),
    move: false,
  });
  const focus = useFocus(context, {
    enabled: isEmpty(controlledOpen),
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
};

type ContextType = null | ReturnType<typeof useTooltip>;

const TooltipContext = createContext<ContextType>(null);

export const useTooltipContext = (): ContextType => {
  const context = useContext(TooltipContext);

  if (isEmpty(context)) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export const Tooltip = ({
  children,
  ...options
}: { children: ReactNode } & TooltipOptions): ReactElement => {
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = forwardRef<
  HTMLButtonElement,
  HTMLProps<HTMLButtonElement> & { asChild?: boolean }
>(function TooltipTrigger({ asChild = false, children, ...props }, propRef) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context?.refs.setReference, propRef, childrenRef]);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context?.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      })
    );
  }

  return (
    <span
      data-state={context?.open === true ? 'open' : 'closed'}
      ref={ref}
      {...context?.getReferenceProps(props)}
    >
      {children}
    </span>
  );
});

export const TooltipContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function TooltipContent({ style, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context?.refs.setFloating, propRef]);

  if (context?.open === false) return null;

  return (
    <FloatingPortal>
      <div
        style={{
          ...context?.floatingStyles,
          ...style,
        }}
        className="rounded-full bg-black p-2 px-3 py-1.5 font-martianMono text-xxs font-medium text-white shadow-md dark:bg-white dark:text-black"
        ref={ref}
        {...context?.getFloatingProps(props)}
      />
    </FloatingPortal>
  );
});
