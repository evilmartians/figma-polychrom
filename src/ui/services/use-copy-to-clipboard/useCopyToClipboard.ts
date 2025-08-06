import { on } from 'svelte/events';

interface ActionReturn<
  Parameter = undefined,
  Attributes extends Record<string, any> = Record<never, any>,
> {
  $$_attributes?: Attributes;
  destroy?: () => void;
  update?: (parameter: Parameter) => void;
}

export interface TextResolverInput<K extends keyof HTMLElementEventMap> {
  event: HTMLElementEventMap[K];
  node: HTMLElement;
  trigger: HTMLElement;
}

export type TextResolver<K extends keyof HTMLElementEventMap> = (
  input: TextResolverInput<K>
) => Promise<string> | string;

export interface CopyConfig<K extends keyof HTMLElementEventMap> {
  enabled: boolean;
  event: K | K[];
  synthetic: boolean;
  text: string | TextResolver<K>;
  trigger: HTMLElement;
}

export interface CopyAttributes {
  oncopied?: (event: CustomEvent<CopyDetail>) => void;
}

export type CopyReturn<K extends keyof HTMLElementEventMap> = ActionReturn<
  CopyParameter<K>,
  CopyAttributes
>;

type CopyParameter<K extends keyof HTMLElementEventMap> =
  | Partial<CopyConfig<K>>
  | undefined;

export interface CopyDetail {
  text: string;
}

const copyToClipboard = function (text: string): Promise<void> | undefined {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement('textarea');

    element.value = text;

    element.setAttribute('readonly', '');

    element.style.contain = 'strict';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.fontSize = '12pt'; // Prevent zooming on iOS

    const selection = document.getSelection();
    const originalRange =
      selection != null
        ? selection.rangeCount > 0 && selection.getRangeAt(0)
        : null;

    document.body.appendChild(element);
    element.select();

    element.selectionStart = 0;
    element.selectionEnd = text.length;

    document.execCommand('copy');
    document.body.removeChild(element);

    if (Boolean(originalRange) && selection != null) {
      selection.removeAllRanges(); // originalRange can't be truthy when selection is falsy
      selection.addRange(originalRange as Range);
    }
  }
};

export const copy = function <K extends keyof HTMLElementEventMap>(
  node: HTMLElement,
  parameter: CopyParameter<K> = {}
): CopyReturn<K> {
  let { enabled, events, synthetic, text, trigger } = resolveConfig(
    node,
    parameter
  );

  const handler = async function (e: HTMLElementEventMap[K]): Promise<void> {
    const rText = await text({ event: e, node, trigger });
    await copyToClipboard(rText);

    const detail: CopyDetail = { text: rText };
    node.dispatchEvent(new CustomEvent('copied', { detail }));

    if (synthetic) {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', rText);
      /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
      const event = new ClipboardEvent('copy', {
        clipboardData,
        data: rText,
        dataType: 'text/plain',
      } as ClipboardEventInit);
      node.dispatchEvent(event);
    }
  };

  let offs: Array<() => void> = [];

  const addEvents = function (): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    offs = events.map((event) => on(trigger, event as K, handler));
  };

  const removeEvents = function (): void {
    offs.forEach((unsub) => {
      unsub();
    });
    offs = [];
  };

  if (enabled) addEvents();

  return {
    destroy() {
      removeEvents();
    },
    update(update: CopyParameter<K> = {}) {
      removeEvents();
      ({ enabled, events, synthetic, text, trigger } = resolveConfig(
        node,
        update
      ));
      addEvents();
    },
  };
};

const resolveConfig = function <K extends keyof HTMLElementEventMap>(
  node: HTMLElement,
  param: CopyParameter<K> = {}
): {
  enabled: boolean;
  events: Array<'click'> | K[];
  synthetic: boolean;
  text: TextResolver<K>;
  trigger: HTMLElement;
} {
  const { enabled = true, synthetic = false, trigger = node } = param;
  const text =
    typeof param.text === 'function'
      ? param.text
      : () => param.text ?? node.innerText;
  const events =
    typeof param.event === 'string'
      ? [param.event]
      : (param.event ?? ['click']);
  return { enabled, events, synthetic, text: text as TextResolver<K>, trigger };
};
