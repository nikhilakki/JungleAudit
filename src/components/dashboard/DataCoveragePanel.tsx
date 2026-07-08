import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Data coverage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {ingested.map((file) => (
            <Badge key={file.fileType} variant="outline">
              {file.label} · {file.rows.toLocaleString()} rows
            </Badge>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Unlocked insights</p>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {available.map((insight) => (
                <li key={insight.id}>{insight.title}</li>
              ))}
            </ul>
          </div>
          {missingInsights.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Add more files for</p>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {missingInsights.map((insight) => (
                  <li key={insight.id}>{insight.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}