import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FILE_TYPE_LABELS,
  type FileSchemaInfo,
  type MappingConfidence,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

interface SchemaPreviewProps {
  schemas: FileSchemaInfo[];
  defaultOpen?: boolean;
}

function confidenceVariant(
  confidence: MappingConfidence,
): "success" | "warning" | "secondary" {
  switch (confidence) {
    case "exact":
      return "success";
    case "fuzzy":
      return "warning";
    default:
      return "secondary";
  }
}

export function SchemaPreview({ schemas, defaultOpen = false }: SchemaPreviewProps) {
  if (schemas.length === 0) return null;

  const missingCount = schemas.filter((s) => s.missingRequired.length > 0).length;

  return (
    <details className="group rounded-3xl bg-muted" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-5 [&::-webkit-details-marker]:hidden md:px-8">
        <div className="flex flex-col gap-1">
          <span className="font-display font-extrabold tracking-tight">
            Column mappings
          </span>
          <span className="text-sm text-muted-foreground">
            {schemas.length} file{schemas.length === 1 ? "" : "s"} detected
            {missingCount > 0
              ? ` · ${missingCount} with missing required fields`
              : ""}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform",
            "group-open:rotate-180",
          )}
        />
      </summary>

      <div className="flex flex-col gap-4 px-6 pb-6 md:px-8 md:pb-8">
        {schemas.map((schema) => (
          <div
            key={`${schema.originalName}-${schema.rawTable}`}
            className="rounded-2xl bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] md:p-6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-extrabold tracking-tight">
                  {schema.originalName}
                </h3>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  {FILE_TYPE_LABELS[schema.fileType]}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {schema.rowCount.toLocaleString()} rows
                </span>
              </div>
              {schema.missingRequired.length > 0 ? (
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  Missing required fields: {schema.missingRequired.join(", ")}
                </p>
              ) : null}
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Detected column</th>
                    <th className="py-2 pr-4 font-medium">Type</th>
                    <th className="py-2 pr-4 font-medium">Canonical field</th>
                    <th className="py-2 font-medium">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {schema.mappings.map((mapping) => (
                    <tr
                      key={`${schema.rawTable}-${mapping.sourceColumn}`}
                      className="border-b border-border/60"
                    >
                      <td className="py-2 pr-4 font-mono text-xs">
                        {mapping.sourceColumn}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {
                          schema.columns.find(
                            (c) => c.column_name === mapping.sourceColumn,
                          )?.column_type
                        }
                      </td>
                      <td className="py-2 pr-4">
                        {mapping.canonical ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2">
                        <Badge variant={confidenceVariant(mapping.confidence)}>
                          {mapping.confidence}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
