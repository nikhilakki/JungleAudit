import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Brand series palette. Order matters: indigo, rose, mint, clay, then ink.
 * Must stay in sync with --cobalt/--pink/--cyan/--tan in index.css. The ink
 * stop is resolved from the `text-primary` probe element.
 */
const SERIES_PALETTE = [
  "rgb(91, 95, 224)", // indigo #5b5fe0
  "rgb(238, 146, 182)", // rose #ee92b6
  "rgb(63, 222, 196)", // mint #3fdec4
  "rgb(221, 146, 96)", // clay #dd9260
];

const FALLBACK_INK = "rgb(10, 10, 11)"; // #0a0a0b
const FALLBACK_GRID = "#e9e9ea";
const FALLBACK_TICK = "#6f6f76";

export function withAlpha(rgb: string, alpha: number): string {
  const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
  if (!match) return rgb;
  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
}

export function useChartTheme() {
  const probeRef = useRef<HTMLSpanElement>(null);
  const [ink, setInk] = useState(FALLBACK_INK);
  const [gridColor, setGridColor] = useState(FALLBACK_GRID);
  const [tickColor, setTickColor] = useState(FALLBACK_TICK);

  useEffect(() => {
    if (!probeRef.current) return;
    // Probe carries `text-primary` so the ink stop always matches the tokens.
    setInk(getComputedStyle(probeRef.current).color);
    // Grid + tick colors come from the semantic CSS variables to keep the
    // near-invisible hairlines and muted labels in sync with the theme.
    const root = getComputedStyle(document.documentElement);
    const border = root.getPropertyValue("--border").trim();
    const muted = root.getPropertyValue("--muted-foreground").trim();
    if (border) setGridColor(border);
    if (muted) setTickColor(muted);
  }, []);

  const colors = useMemo(() => [...SERIES_PALETTE, ink], [ink]);

  return {
    colors,
    /** Cobalt — the Finsage brand accent; identical in both themes. */
    primaryColor: SERIES_PALETTE[0],
    /** Pink — second series stop, used for refund/return charts. */
    accentColor: SERIES_PALETTE[1],
    gridColor,
    tickColor,
    probeRef,
  };
}
