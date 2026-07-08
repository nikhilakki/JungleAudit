import type { FileSchemaInfo } from "./schema";

export type WorkerRequestPayload =
  | { type: "init" }
  | { type: "reset" }
  | {
      type: "ingest";
      files: Array<{ name: string; buffer: ArrayBuffer }>;
    }
  | { type: "createViews"; schemas: FileSchemaInfo[] }
  | { type: "query"; sql: string };

export type WorkerRequest = WorkerRequestPayload & { id: number };

export type WorkerResponse =
  | { type: "ready"; id: number }
  | { type: "error"; id: number; message: string }
  | { type: "ingested"; id: number; schemas: FileSchemaInfo[] }
  | { type: "viewsCreated"; id: number }
  | { type: "queryResult"; id: number; rows: Record<string, unknown>[] };