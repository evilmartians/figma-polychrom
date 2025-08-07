import { useSignal } from '@preact/signals';
import copy from 'copy-to-clipboard';
import { useEffect, useRef } from 'preact/hooks';

export const useClipboard = (
  value: string,
  options?: {
    successDuration?: number;
  }
): [boolean, () => void] => {
  const isCopied = useSignal(false);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const successDuration = options?.successDuration ?? 2000;

  const setCopied = (): void => {
    const copied = copy(value);
    isCopied.value = copied;

    if (copied) {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        isCopied.value = false;
      }, successDuration);
    }
  };

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    []
  );

  return [isCopied.value, setCopied];
};
