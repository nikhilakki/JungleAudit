import type { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "@/components/charts/chart-setup";
import { useChartTheme } from "@/components/charts/useChartTheme";
import type {
  BorrowingByTypeRow,
  BorrowingTrendPoint,
} from "@/lib/analytics/borrowing";
import type { TrendGranularity } from "@/lib/analytics/date-filter";

interface BorrowingChartsProps {
  byType: BorrowingByTypeRow[];
  trend: BorrowingTrendPoint[];
  granularity: TrendGranularity;
}

function formatPeriodLabel(period: string, granularity: TrendGranularity): string {
  const date = new Date(period);
  if (Number.isNaN(date.getTime())) return period;
  if (granularity === "year") return date.getFullYear().toString();
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export function BorrowingCharts({ byType, trend, granularity }: BorrowingChartsProps) {
  const { colors, primaryColor, probeRef } = useChartTheme();

  const typeData = useMemo<ChartData<"doughnut">>(
    () => ({
      labels: byType.map((row) => row.content_type),
      datasets: [
        {
          data: byType.map((row) => row.count),
          backgroundColor: byType.map((_, i) => colors[i % colors.length]),
          borderWidth: 0,
        },
      ],
    }),
    [byType, colors],
  );

  const trendData = useMemo<ChartData<"bar">>(
    () => ({
      labels: trend.map((p) => formatPeriodLabel(p.period, granularity)),
      datasets: [
        {
          label: "Borrows",
          data: trend.map((p) => p.count),
          backgroundColor: primaryColor,
          borderRadius: 4,
        },
      ],
    }),
    [granularity, primaryColor, trend],
  );

  const doughnutOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    }),
    [],
  );

  const barOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    }),
    [],
  );

  if (byType.length === 0 && trend.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No borrowing activity found.</p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {byType.length > 0 ? (
        <div className="h-64">
          <p className="mb-2 text-sm font-medium">By content type</p>
          <Doughnut data={typeData} options={doughnutOptions} />
        </div>
      ) : null}
      {trend.length > 0 ? (
        <div className="h-64">
          <p className="mb-2 text-sm font-medium">Borrows over time</p>
          <Bar data={trendData} options={barOptions} />
        </div>
      ) : null}
      <span ref={probeRef} className="pointer-events-none absolute opacity-0 text-primary" />
    </div>
  );
}