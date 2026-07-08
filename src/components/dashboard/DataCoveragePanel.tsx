import {
  DATA_INSIGHTS,
  getAvailableInsights,
  getIngestedFileSummary,
} from "@/lib/data-insights";
import type { FileSchemaInfo } from "@/lib/schema";

interface DataCoveragePanelProps {
  schemas: FileSchemaInfo[];
}

export function DataCoveragePanel({ schemas }: DataCoveragePanelProps) {
  const ingested = getIngestedFileSummary(schemas);
  const available = getAvailableInsights(schemas);
  const missingInsights = DATA_INSIGHTS.filter(
    (insight) => !available.some((a) => a.id === insight.id),
  );

  if (ingested.length === 0) return null;

  return (
    <section className="rounded-3xl bg-muted p-6 md:p-8">
      <h2 className="font-display text-lg font-extrabold tracking-tight">
        Data coverage
      </h2>

      <div className="mt-4 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {ingested.map((file) => (
            <span
              key={file.fileType}
              className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
            >
              {file.label} · {file.rows.toLocaleString()} rows
            </span>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />
              Unlocked insights
            </p>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {available.map((insight) => (
                <li key={insight.id}>{insight.title}</li>
              ))}
            </ul>
          </div>
          {missingInsights.length > 0 ? (
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <span
                  className="size-1.5 rounded-full bg-muted-foreground"
                  aria-hidden="true"
                />
                Add more files for
              </p>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {missingInsights.map((insight) => (
                  <li key={insight.id}>{insight.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
