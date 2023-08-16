import React from 'react';

import { type FigmaPaint } from '../../types/figma.ts';

interface Props {
  fill: FigmaPaint;
}

export const ColorIndicator: React.FC<Props> = ({ fill }) => {
  return (
    <svg
      fill="none"
      height="26"
      viewBox="0 0 22 26"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M0 6.5L11 0L22 6.5V19.5L11 26L0 19.5V6.5Z"
          fill={fill.hex}
          fillOpacity={fill.opacity}
        />
        <path d="M0.25 19.3573V6.64266L11 0.290385L21.75 6.64266V19.3573L11 25.7096L0.25 19.3573Z" />
      </g>
    </svg>
  );
};
