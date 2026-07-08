import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FILE_TYPE_LABELS,
  type FileSchemaInfo,
  type MappingConfidence,
} from "@/lib/schema";

interface SchemaPreviewProps {
  schemas: FileSchemaInfo[];
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

export function SchemaPreview({ schemas }: SchemaPreviewProps) {
  if (schemas.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {schemas.map((schema) => (
        <Card key={`${schema.originalName}-${schema.rawTable}`}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{schema.originalName}</CardTitle>
              <Badge variant="outline">{FILE_TYPE_LABELS[schema.fileType]}</Badge>
              <Badge variant="secondary">{schema.rowCount.toLocaleString()} rows</Badge>
            </div>
            {schema.missingRequired.length > 0 ? (
              <p className="text-sm text-amber-700 dark:text-amber-200">
                Missing required fields: {schema.missingRequired.join(", ")}
              </p>
            ) : null}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}