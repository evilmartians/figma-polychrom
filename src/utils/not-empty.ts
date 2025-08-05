export const notEmpty = <TValue>(
  value: null | TValue | undefined
): value is TValue => value !== null && value !== undefined;

export const isEmpty = <TValue>(
  value: null | TValue | undefined
): value is null | undefined => value === null || value === undefined;
