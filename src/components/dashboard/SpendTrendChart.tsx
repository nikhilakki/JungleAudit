import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "@/components/charts/chart-setup";
import { useChartTheme, withAlpha } from "@/components/charts/useChartTheme";
import type { TrendGranularity } from "@/lib/analytics/date-filter";
import type { PeriodSpend } from "@/lib/analytics/spend-trends";

interface SpendTrendChartProps {
  data: PeriodSpend[];
  currencyCode: string;
  granularity: TrendGranularity;
}

function formatPeriodLabel(period: string, granularity: TrendGranularity): string {
  const date = new Date(period);
  if (Number.isNaN(date.getTime())) return period;

  switch (granularity) {
    case "day":
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    case "week":
      return `W${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    case "month":
      return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
    case "year":
      return date.getFullYear().toString();
    default:
      return period;
  }
}

export function SpendTrendChart({
  data,
  currencyCode,
  granularity,
}: SpendTrendChartProps) {
  const { primaryColor, gridColor, tickColor, probeRef } = useChartTheme();
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }),
    [currencyCode],
  );

  const chartData = useMemo<ChartData<"line">>(
    () => ({
      labels: data.map((point) => formatPeriodLabel(point.period, granularity)),
      datasets: [
        {
          label: "Spend",
          data: data.map((point) => point.spend),
          borderColor: primaryColor,
          backgroundColor: withAlpha(primaryColor, 0.1),
          pointBackgroundColor: primaryColor,
          pointBorderColor: primaryColor,
          pointHoverRadius: 6,
          pointRadius: 3,
          borderWidth: 2,
          fill: true,
          tension: 0.25,
        },
      ],
    }),
    [data, granularity, primaryColor],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"line">) => {
              const value = context.parsed.y ?? 0;
              return `Spend: ${currencyFormatter.format(value)}`;
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
          limits: {
            x: { min: "original", max: "original" },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: { display: false },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
            color: tickColor,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
          },
          border: { display: false },
          ticks: {
            color: tickColor,
            callback: (value) =>
              currencyFormatter.format(typeof value === "number" ? value : Number(value)),
          },
        },
      },
    }),
    [currencyFormatter, gridColor, tickColor],
  );

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No spend data for the selected date range.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Scroll or pinch to zoom · drag to pan · hover points for details
      </p>
      <div className="h-80 w-full">
        <Line data={chartData} options={options} />
      </div>
      <span ref={probeRef} className="pointer-events-none absolute opacity-0 text-primary" />
    </div>
  );
}
