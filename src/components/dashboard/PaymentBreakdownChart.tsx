import type { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "@/components/charts/chart-setup";
import { useChartTheme } from "@/components/charts/useChartTheme";
import type { PaymentBreakdownRow } from "@/lib/analytics/payments";

interface PaymentBreakdownChartProps {
  data: PaymentBreakdownRow[];
  currencyCode: string;
}

export function PaymentBreakdownChart({
  data,
  currencyCode,
}: PaymentBreakdownChartProps) {
  const { colors, tickColor, probeRef } = useChartTheme();
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }),
    [currencyCode],
  );

  const chartData = useMemo<ChartData<"doughnut">>(
    () => ({
      labels: data.map((row) => row.payment_method),
      datasets: [
        {
          data: data.map((row) => row.spend),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    [colors, data],
  );

  const options = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "right",
          labels: { boxWidth: 8, boxHeight: 8, padding: 14, color: tickColor },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = typeof ctx.parsed === "number" ? ctx.parsed : 0;
              const row = data[ctx.dataIndex];
              return `${formatter.format(value)} · ${row?.order_count ?? 0} orders`;
            },
          },
        },
      },
    }),
    [data, formatter, tickColor],
  );

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No payment method data in this date range.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <Doughnut data={chartData} options={options} />
      <span ref={probeRef} className="pointer-events-none absolute opacity-0 text-primary" />
    </div>
  );
}
