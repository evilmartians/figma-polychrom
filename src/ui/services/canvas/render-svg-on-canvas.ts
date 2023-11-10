export const renderSvgOnCanvas = async (
  ctx: OffscreenCanvasRenderingContext2D,
  svg: SVGSVGElement
): Promise<void> => {
  await new Promise((resolve) => {
    const img = document.createElement('img');
    const xml = new XMLSerializer().serializeToString(svg);

    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';

    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      resolve(true);
    };

    img.src = b64Start + svg64;
  });
};
