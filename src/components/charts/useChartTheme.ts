import { useEffect, useMemo, useRef, useState } from "react";

const CHART_PALETTE = [
  "rgb(45, 138, 78)",
  "rgb(59, 130, 246)",
  "rgb(234, 179, 8)",
  "rgb(168, 85, 247)",
  "rgb(236, 72, 153)",
  "rgb(20, 184, 166)",
  "rgb(249, 115, 22)",
  "rgb(107, 114, 128)",
];

export function withAlpha(rgb: string, alpha: number): string {
  const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
  if (!match) return rgb;
  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
}

export function useChartTheme() {
  const probeRef = useRef<HTMLSpanElement>(null);
  const [primaryColor, setPrimaryColor] = useState(CHART_PALETTE[0]);

  useEffect(() => {
    if (!probeRef.current) return;
    setPrimaryColor(getComputedStyle(probeRef.current).color);
  }, []);

  const colors = useMemo(() => {
    const base = [primaryColor, ...CHART_PALETTE.filter((c) => c !== primaryColor)];
    return base;
  }, [primaryColor]);

  return { colors, primaryColor, probeRef };
}