import { type FigmaPaint } from '~types/figma.ts';

export enum ClientStorageKeys {
  savedColorSpaceDisplayMode = 'colorSpaceDisplayMode',
}

export interface ColorPair {
  apca: number;
  bg: FigmaPaint;
  fg: FigmaPaint;
  id: string;
}
