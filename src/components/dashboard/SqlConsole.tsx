import { Loader2, Play, RotateCcw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/ga4";
import { runConsoleQuery, runQuery } from "@/lib/duckdb";
import type { SqlConsoleCell, SqlConsoleData } from "@/lib/duckdb-types";
import type { FileSchemaInfo } from "@/lib/schema";
import { validateReadOnlySql } from "@/lib/sql-guard";
import { buildSampleQueries, type SampleQuery } from "@/lib/sql-samples";

interface SqlConsoleProps {
  schemas: FileSchemaInfo[];
  busy: boolean;
  onResetData: () => Promise<void>;
}

type TableInfo = {
  name: string;
  type: string;
};

const TABLES_SQL = `SELECT table_name AS name, table_type AS type
FROM information_schema.tables
WHERE table_schema = 'main'
ORDER BY table_type DESC, table_name`;

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function SampleChip({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-card px-3 py-1.5 text-xs font-medium shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function formatCell(cell: SqlConsoleCell): ReactNode {
  if (cell === null) {
    return <span className="italic text-muted-foreground">null</span>;
  }
  if (typeof cell === "number") {
    return cell.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  return String(cell);
}

export function SqlConsole({ schemas, busy, onResetData }: SqlConsoleProps) {
  const [sql, setSql] = useState("");
  const [running, setRunning] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [result, setResult] = useState<SqlConsoleData | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  // Guards against overlapping runs when state hasn't flushed yet (e.g. rapid
  // ⌘↵). A ref updates synchronously; the `running` state only re-renders.
  const inFlightRef = useRef(false);

  const samples = useMemo(() => buildSampleQueries(schemas), [schemas]);
  const sampleGroups = useMemo(() => {
    const groups = new Map<string, SampleQuery[]>();
    for (const sample of samples) {
      const list = groups.get(sample.category);
      if (list) list.push(sample);
      else groups.set(sample.category, [sample]);
    }
    return [...groups.entries()];
  }, [samples]);

  useEffect(() => {
    let cancelled = false;
    runQuery<TableInfo>(TABLES_SQL)
      .then((rows) => {
        if (!cancelled) setTables(rows);
      })
      .catch(() => {
        if (!cancelled) setTables([]);
      });
    return () => {
      cancelled = true;
    };
  }, [schemas]);

  // The dataset was rebuilt (new upload or reset) — old results are stale.
  useEffect(() => {
    setResult(null);
    setQueryError(null);
  }, [schemas]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const run = useCallback(async (text: string) => {
    if (inFlightRef.current) return;

    const verdict = validateReadOnlySql(text);
    if (!verdict.ok) {
      setResult(null);
      setNotice(null);
      setQueryError(verdict.reason);
      return;
    }

    inFlightRef.current = true;
    setRunning(true);
    setQueryError(null);
    setNotice(null);
    try {
      const data = await runConsoleQuery(text);
      setResult(data);
      trackEvent("sql_console_run", { ok: true });
    } catch (err) {
      setResult(null);
      setQueryError(err instanceof Error ? err.message : String(err));
      trackEvent("sql_console_run", { ok: false });
    } finally {
      inFlightRef.current = false;
      setRunning(false);
    }
  }, []);

  const runSample = useCallback(
    (text: string) => {
      setSql(text);
      void run(text);
    },
    [run],
  );

  const handleReset = useCallback(async () => {
    setResetting(true);
    setQueryError(null);
    setNotice(null);
    try {
      await onResetData();
      setResult(null);
      setNotice("Tables and views were rebuilt from your original files.");
      trackEvent("sql_console_reset");
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : String(err));
    } finally {
      setResetting(false);
    }
  }, [onResetData]);

  const disabled = busy || running || resetting;

  const handleEditorKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (disabled || sql.trim().length === 0) return;
        void run(sql);
      }
    },
    [disabled, run, sql],
  );
  const truncated = result !== null && result.rows.length < result.totalRows;

  return (
    <section className="rounded-3xl bg-muted p-5 md:p-7">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-extrabold tracking-tight">
          SQL console
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
            Read-only
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleReset()}
            disabled={disabled}
          >
            {resetting ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RotateCcw className="size-3.5" aria-hidden="true" />
            )}
            Reset data
          </Button>
        </div>
      </div>

      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Query the tables built from your export, right in your browser. Only read
        statements run here — and Reset data rebuilds everything from your
        original files if you ever want a clean slate.
      </p>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-shadow focus-within:ring-2 focus-within:ring-foreground/20 md:p-5">
          <label htmlFor="sql-console-editor" className="sr-only">
            SQL query
          </label>
          <textarea
            id="sql-console-editor"
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            onKeyDown={handleEditorKeyDown}
            rows={5}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="SELECT * FROM canonical_all_orders LIMIT 20"
            className="w-full resize-y bg-transparent font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              One statement at a time · ⌘↵ / Ctrl↵ to run
            </p>
            <Button
              size="sm"
              onClick={() => void run(sql)}
              disabled={disabled || sql.trim().length === 0}
            >
              {running ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="size-3.5" aria-hidden="true" />
              )}
              Run query
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {sampleGroups.map(([category, list]) => (
            <div key={category} className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
                {category}
              </span>
              {list.map((sample) => (
                <SampleChip
                  key={sample.id}
                  label={sample.title}
                  disabled={disabled}
                  onClick={() => runSample(sample.sql)}
                />
              ))}
            </div>
          ))}
        </div>

        {tables.length > 0 ? (
          <details>
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              Tables &amp; views ({tables.length})
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {tables.map((table) => (
                <SampleChip
                  key={table.name}
                  label={
                    table.type === "VIEW" ? table.name : `${table.name} (raw)`
                  }
                  disabled={disabled}
                  onClick={() =>
                    runSample(`SELECT * FROM ${table.name} LIMIT 20`)
                  }
                />
              ))}
            </div>
          </details>
        ) : null}

        {queryError ? (
          <Alert className="rounded-2xl border-0 bg-destructive/10 p-4 shadow-none">
            <AlertTitle className="text-sm font-semibold text-destructive">
              Query error
            </AlertTitle>
            <AlertDescription className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">
              {queryError}
            </AlertDescription>
          </Alert>
        ) : null}

        {notice ? (
          <Alert className="rounded-2xl border-0 bg-accent p-4 shadow-none">
            <AlertDescription className="text-sm text-accent-foreground">
              {notice}
            </AlertDescription>
          </Alert>
        ) : null}

        {result ? (
          <div className="rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] md:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <MetaChip>
                {result.totalRows.toLocaleString()}{" "}
                {result.totalRows === 1 ? "row" : "rows"}
              </MetaChip>
              <MetaChip>{result.elapsedMs.toLocaleString()} ms</MetaChip>
              {truncated ? (
                <MetaChip>showing first {result.rows.length}</MetaChip>
              ) : null}
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              Query returned {result.totalRows.toLocaleString()}{" "}
              {result.totalRows === 1 ? "row" : "rows"} in {result.elapsedMs}{" "}
              milliseconds
              {truncated ? `, showing the first ${result.rows.length}` : ""}.
            </p>
            {result.totalRows === 0 ? (
              <p className="text-sm text-muted-foreground">
                Query ran fine — no rows came back.
              </p>
            ) : (
              <div className="max-h-96 overflow-auto rounded-xl">
                <table className="w-full border-separate border-spacing-0 text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-card">
                    <tr>
                      {result.columns.map((column, index) => (
                        <th
                          key={`${column}-${index}`}
                          className="whitespace-nowrap border-b border-border bg-card px-3 py-2 font-semibold"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="odd:bg-muted/40">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            title={cell === null ? undefined : String(cell)}
                            className="max-w-80 truncate whitespace-nowrap px-3 py-1.5 align-top font-mono tabular-nums"
                          >
                            {formatCell(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
