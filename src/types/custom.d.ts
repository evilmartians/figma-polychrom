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
