import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "@/components/charts/chart-setup";
import { useChartTheme, withAlpha } from "@/components/charts/useChartTheme";
import type { TrendGranularity } from "@/lib/analytics/date-filter";
import type { RefundTrendPoint } from "@/lib/analytics/returns";

interface RefundTrendChartProps {
  data: RefundTrendPoint[];
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

export function RefundTrendChart({
  data,
  currencyCode,
  granularity,
}: RefundTrendChartProps) {
  const { accentColor, gridColor, tickColor, probeRef } = useChartTheme();
  const formatter = useMemo(
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
          label: "Refunded",
          data: data.map((point) => point.refunded),
          borderColor: accentColor,
          backgroundColor: withAlpha(accentColor, 0.12),
          pointBackgroundColor: accentColor,
          pointBorderColor: accentColor,
          pointRadius: 3,
          borderWidth: 2,
          fill: true,
          tension: 0.25,
        },
      ],
    }),
    [accentColor, data, granularity],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"line">) =>
              `Refunded: ${formatter.format(context.parsed.y ?? 0)}`,
          },
        },
        zoom: {
          pan: { enabled: true, mode: "x" },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
          limits: { x: { min: "original", max: "original" } },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { maxTicksLimit: 12, color: tickColor },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          border: { display: false },
          ticks: {
            color: tickColor,
            callback: (value) =>
              formatter.format(typeof value === "number" ? value : Number(value)),
          },
        },
      },
    }),
    [formatter, gridColor, tickColor],
  );

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No refund activity in this range.</p>
    );
  }

  return (
    <div className="h-72 w-full">
      <Line data={chartData} options={options} />
      <span ref={probeRef} className="pointer-events-none absolute opacity-0 text-primary" />
    </div>
  );
}
