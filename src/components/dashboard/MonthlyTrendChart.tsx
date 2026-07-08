import * as Plot from "@observablehq/plot";
import { useMemo } from "react";
import { PlotChart } from "@/components/charts/PlotChart";
import type { MonthlySpend } from "@/lib/analytics/spend-trends";

interface MonthlyTrendChartProps {
  data: MonthlySpend[];
  currencyCode: string;
}

export function MonthlyTrendChart({ data, currencyCode }: MonthlyTrendChartProps) {
  const options = useMemo<Plot.PlotOptions>(
    () => ({
      marginLeft: 56,
      marginBottom: 40,
      x: {
        type: "utc",
        label: "Month",
      },
      y: {
        label: "Spend",
        grid: true,
        tickFormat: (value: number) =>
          new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(value),
      },
      marks: [
        Plot.lineY(data, {
          x: (d) => new Date(d.month),
          y: "spend",
          stroke: "var(--primary)",
          strokeWidth: 2,
        }),
        Plot.dot(data, {
          x: (d) => new Date(d.month),
          y: "spend",
          fill: "var(--primary)",
          r: 3,
        }),
      ],
    }),
    [data, currencyCode],
  );

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No monthly trend data available for the uploaded files.
      </p>
    );
  }

  return <PlotChart options={options} className="w-full overflow-x-auto" />;
}