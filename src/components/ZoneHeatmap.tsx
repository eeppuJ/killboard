import { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

export function ZoneHeatmap({
  zoneId,
  data,
  size = 640,
}: {
  zoneId: string;
  data: h337.HeatmapData<h337.DataPoint<'value', 'x', 'y'>>;
  size: number;
}): JSX.Element {
  const divElement = useRef<HTMLDivElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current == null || divElement.current == null) return;

    const canvasWidth = canvasElement.current.width;
    canvasElement.current.height = canvasWidth;
    const ctx = canvasElement.current.getContext('2d');
    if (ctx == null) return;

    const image = new Image();
    image.src = `/images/maps/${zoneId}.webp`;
    image.onload = () => {
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvasWidth,
        canvasWidth,
      );
    };

    const heatmapInstance = h337.create({
      container: divElement.current,
    });
    heatmapInstance.setData(data);
  });

  return (
    <div ref={divElement} style={{ width: `${size}px`, height: `${size}px` }}>
      <canvas
        ref={canvasElement}
        width={size}
        height={size}
        style={{ position: 'absolute', left: '0px', top: '0px' }}
      />
    </div>
  );
}
