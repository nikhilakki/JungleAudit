import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";

interface PlotChartProps {
  options: Plot.PlotOptions;
  className?: string;
}

export function PlotChart({ options, className }: PlotChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();
    const plot = Plot.plot({
      ...options,
      width: container.clientWidth || 640,
    });
    container.append(plot);

    return () => {
      container.replaceChildren();
    };
  }, [options]);

  return <div ref={containerRef} className={className} />;
}