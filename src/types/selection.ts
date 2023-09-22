import { type FigmaPaint } from './figma.ts';

export interface SelectedNodes {
  apca: null | number;
  bg: FigmaPaint;
  fg: FigmaPaint;
  id: string;
}
