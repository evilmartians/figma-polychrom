import { type ReactElement } from 'react';

import { type FigmaPaint } from '../../types/figma.ts';
import { ColorIndicator } from './ColorIndicator';

interface Props {
  bg: FigmaPaint;
  fg: FigmaPaint;
}

export const ColorIndicators = ({ bg, fg }: Props): ReactElement => (
  <div className="relative top-1.5 flex items-center justify-center">
    <div className="">
      <div className="relative z-10">
        <ColorIndicator fill={fg} />
      </div>
      <div className="relative bottom-3">
        <ColorIndicator fill={bg} />
      </div>
    </div>
  </div>
);
