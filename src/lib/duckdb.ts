import type {
  SqlConsoleData,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse,
} from "./duckdb-types";
import type { FileSchemaInfo } from "./schema";

type PendingRequest = {
  resolve: (response: WorkerResponse) => void;
  reject: (error: Error) => void;
};

let worker: Worker | null = null;
let requestId = 0;
const pending = new Map<number, PendingRequest>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(
      new URL("../workers/duckdb.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, ...response } = event.data;
      const handler = pending.get(id);
      if (!handler) return;
      pending.delete(id);
      if (response.type === "error") {
        handler.reject(new Error(response.message));
      } else {
        handler.resolve({ ...response, id } as WorkerResponse);
      }
    };

    worker.onerror = (event) => {
      for (const handler of pending.values()) {
        handler.reject(new Error(event.message));
      }
      pending.clear();
    };
  }
  return worker;
}

function sendRequest<T extends WorkerResponse>(
  request: WorkerRequestPayload,
): Promise<T> {
  const id = ++requestId;
  const w = getWorker();
  return new Promise<T>((resolve, reject) => {
    pending.set(id, {
      resolve: (response) => resolve(response as T),
      reject,
    });
    w.postMessage({ ...request, id } satisfies WorkerRequest);
  });
}

export async function initDuckDB(): Promise<void> {
  const response = await sendRequest<Extract<WorkerResponse, { type: "ready" }>>({
    type: "init",
  });
  if (response.type !== "ready") {
    throw new Error("Failed to initialize DuckDB");
  }
}

export async function resetDuckDB(): Promise<void> {
  await sendRequest({ type: "reset" });
}

export async function ingestFiles(files: File[]): Promise<FileSchemaInfo[]> {
  const payloads = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      buffer: await file.arrayBuffer(),
    })),
  );

  const response = await sendRequest<
    Extract<WorkerResponse, { type: "ingested" }>
  >({
    type: "ingest",
    files: payloads,
  });

  if (response.type !== "ingested") {
    throw new Error("Unexpected ingest response");
  }

  return response.schemas;
}

export async function createCanonicalViews(
  schemas: FileSchemaInfo[],
): Promise<void> {
  const response = await sendRequest<
    Extract<WorkerResponse, { type: "viewsCreated" }>
  >({
    type: "createViews",
    schemas,
  });

  if (response.type !== "viewsCreated") {
    throw new Error("Failed to create canonical views");
  }
}

/** Validated read-only query for the SQL console; rows are capped worker-side. */
export async function runConsoleQuery(sql: string): Promise<SqlConsoleData> {
  const response = await sendRequest<
    Extract<WorkerResponse, { type: "sqlConsoleResult" }>
  >({
    type: "sqlConsole",
    sql,
  });

  if (response.type !== "sqlConsoleResult") {
    throw new Error("Unexpected console query response");
  }

  return response.data;
}

export async function runQuery<T extends Record<string, unknown>>(
  sql: string,
): Promise<T[]> {
  const response = await sendRequest<
    Extract<WorkerResponse, { type: "queryResult" }>
  >({
    type: "query",
    sql,
  });

  if (response.type !== "queryResult") {
    throw new Error("Unexpected query response");
  }

  return response.rows as T[];
}