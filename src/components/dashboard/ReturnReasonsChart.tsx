import type { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "@/components/charts/chart-setup";
import { useChartTheme } from "@/components/charts/useChartTheme";
import type { ReturnReasonRow } from "@/lib/analytics/returns";

interface ReturnReasonsChartProps {
  data: ReturnReasonRow[];
  currencyCode: string;
}

export function ReturnReasonsChart({ data, currencyCode }: ReturnReasonsChartProps) {
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

  const chartData = useMemo<ChartData<"bar">>(
    () => ({
      labels: data.map((row) => row.reason),
      datasets: [
        {
          label: "Refunded",
          data: data.map((row) => row.amount),
          backgroundColor: accentColor,
          borderRadius: 8,
        },
      ],
    }),
    [accentColor, data],
  );

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.x ?? 0;
              const row = data[ctx.dataIndex];
              return `${formatter.format(value)} · ${row?.count ?? 0} returns`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: gridColor },
          border: { display: false },
          ticks: {
            color: tickColor,
            callback: (value) =>
              formatter.format(typeof value === "number" ? value : Number(value)),
          },
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: tickColor },
        },
      },
    }),
    [data, formatter, gridColor, tickColor],
  );

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No return reason data available.</p>
    );
  }

  return (
    <div className="h-80 w-full">
      <Bar data={chartData} options={options} />
      <span ref={probeRef} className="pointer-events-none absolute opacity-0 text-primary" />
    </div>
  );
}
