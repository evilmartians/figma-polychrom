export const calculateRGB = (color: {
  b: number;
  g: number;
  r: number;
}): number[] => Object.values(color).map((value) => Math.round(value * 255));
