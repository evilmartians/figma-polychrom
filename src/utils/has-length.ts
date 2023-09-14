type Indices<L extends number, T extends number[] = []> = T['length'] extends L
  ? T[number]
  : Indices<L, [T['length'], ...T]>;

export type HasLength<T extends readonly any[], L extends number> = Pick<
  Required<T>,
  Indices<L>
>;

export const hasLength = <T extends readonly any[], L extends number>(
  arr: T,
  len: L
): arr is T & HasLength<T, L> => arr.length === len;
