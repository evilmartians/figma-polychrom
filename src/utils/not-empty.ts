export const notEmpty = <TValue>(
  value: null | TValue | undefined
): value is TValue => value !== null && value !== undefined;
