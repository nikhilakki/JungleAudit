import type { FileSchemaInfo } from "./schema";

export type SqlConsoleCell = string | number | boolean | null;

export interface SqlConsoleData {
  columns: string[];
  /** Cell values aligned to `columns` by index; capped at the row limit. */
  rows: SqlConsoleCell[][];
  totalRows: number;
  elapsedMs: number;
}

export type WorkerRequestPayload =
  | { type: "init" }
  | { type: "reset" }
  | {
      type: "ingest";
      files: Array<{ name: string; buffer: ArrayBuffer }>;
    }
  | { type: "createViews"; schemas: FileSchemaInfo[] }
  | { type: "query"; sql: string }
  | { type: "sqlConsole"; sql: string };

export type WorkerRequest = WorkerRequestPayload & { id: number };

export type WorkerResponse =
  | { type: "ready"; id: number }
  | { type: "error"; id: number; message: string }
  | { type: "ingested"; id: number; schemas: FileSchemaInfo[] }
  | { type: "viewsCreated"; id: number }
  | { type: "queryResult"; id: number; rows: Record<string, unknown>[] }
  | { type: "sqlConsoleResult"; id: number; data: SqlConsoleData };