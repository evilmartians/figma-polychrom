declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  // eslint-disable-next-line import/no-default-export
  export default src;
}

declare module 'apca-w3' {
  export {
    adobeRGBtoY,
    alphaBlend,
    APCAcontrast,
    calcAPCA,
    displayP3toY,
    sRGBtoY,
  } from '@types/apca-w3';

  export function fontLookupAPCA(contrast: number, places?: number): number[];
}
