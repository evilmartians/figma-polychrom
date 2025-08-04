import { type Oklch } from 'culori/fn';

interface UIColor {
  hex: string;
  isBlended: boolean;
  oklch: Oklch;
}

export interface ContrastConclusion {
  apca: number;
  bg: UIColor;
  fg: UIColor;
  id: string;
}
