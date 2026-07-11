import * as duckdb from "@duckdb/duckdb-wasm";
import { loadManualDuckDBBundles } from "@/lib/duckdb-bundle";
import type {
  SqlConsoleCell,
  SqlConsoleData,
  WorkerRequest,
  WorkerResponse,
} from "@/lib/duckdb-types";
import { validateReadOnlySql } from "@/lib/sql-guard";
import {
  buildAllOrdersViewSql,
  buildAllRefundsViewSql,
  buildCanonicalViewSql,
  buildColumnMappings,
  canonicalViewName,
  detectFileType,
  getMissingRequiredFields,
  ORDER_VIEW_TYPES,
  REFUND_VIEW_TYPES,
  toTableSlug,
  toVfsName,
  type FileSchemaInfo,
} from "@/lib/schema";

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

/** DuckDB returns Row proxies; structured clone rejects them in postMessage. */
function toPlainRow(row: unknown): Record<string, unknown> {
  if (row === null || typeof row !== "object") return {};
  const plain: Record<string, unknown> = {};
  for (const key of Object.keys(row as object)) {
    const value = (row as Record<string, unknown>)[key];
    plain[key] =
      typeof value === "bigint"
        ? Number(value)
        : value instanceof Date
          ? value.toISOString()
          : value;
  }
  return plain;
}

async function ensureDb(): Promise<duckdb.AsyncDuckDBConnection> {
  if (conn) return conn;

  const manualBundles = await loadManualDuckDBBundles();
  const bundle = await duckdb.selectBundle(manualBundles);
  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  // castDecimalToDouble: DECIMAL columns otherwise arrive as Arrow BigNum
  // objects that serialize to the raw unscaled integer (1.5 -> "15") in the
  // SQL console. Casting to DOUBLE gives correct, cloneable numeric cells.
  await db.open({ query: { castDecimalToDouble: true } });
  conn = await db.connect();
  return conn;
}

async function runQuery<T extends Record<string, unknown>>(
  sql: string,
): Promise<T[]> {
  const connection = await ensureDb();
  const result = await connection.query(sql);
  return result.toArray().map((row) => toPlainRow(row) as T);
}

async function exec(sql: string): Promise<void> {
  const connection = await ensureDb();
  await connection.query(sql);
}

function post(id: number, message: WorkerResponse) {
  self.postMessage({ ...message, id });
}

const MAX_CONSOLE_ROWS = 500;

// Arrow Type enum ids (frozen in arrow-js): Date = 8, Timestamp = 10.
const TEMPORAL_TYPE_IDS = new Set([8, 10]);

// Widest instant Date#toISOString accepts without throwing RangeError.
const MAX_JS_DATE_MS = 8.64e15;

function formatTimestamp(ms: number): string {
  // DuckDB's ±infinity dates arrive as INT32_MAX*86400000, finite but far
  // outside the JS Date range — passing them to new Date() would throw and
  // fail the whole query, so fall back to the raw value.
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_JS_DATE_MS) return String(ms);
  const text = new Date(ms).toISOString().slice(0, 19).replace("T", " ");
  return text.endsWith(" 00:00:00") ? text.slice(0, 10) : text;
}

/** Console cells must survive postMessage and render as text: flatten
 *  bigints, temporals, blobs, and nested arrow values to primitives. */
function toConsoleCell(value: unknown, temporal: boolean): SqlConsoleCell {
  if (value === null || value === undefined) return null;
  if (typeof value === "bigint") {
    const asNumber = Number(value);
    return Number.isSafeInteger(asNumber) ? asNumber : value.toString();
  }
  if (value instanceof Date) return formatTimestamp(value.getTime());
  if (temporal && typeof value === "number") return formatTimestamp(value);
  if (value instanceof Uint8Array) return `<${value.length} bytes>`;
  if (typeof value === "object") {
    try {
      const toJSON = (value as { toJSON?: () => unknown }).toJSON;
      const plain = typeof toJSON === "function" ? toJSON.call(value) : value;
      return JSON.stringify(plain, (_key, v: unknown) =>
        typeof v === "bigint" ? v.toString() : v,
      );
    } catch {
      return String(value);
    }
  }
  return value as SqlConsoleCell;
}

async function runConsoleQuery(sql: string): Promise<SqlConsoleData> {
  const verdict = validateReadOnlySql(sql);
  if (!verdict.ok) throw new Error(verdict.reason);

  const connection = await ensureDb();
  const started = performance.now();
  const table = await connection.query(sql);
  const elapsedMs = Math.max(1, Math.round(performance.now() - started));

  const fields = table.schema.fields;
  const columns = fields.map((field) => field.name);
  const totalRows = table.numRows;
  const limit = Math.min(totalRows, MAX_CONSOLE_ROWS);

  const rows: SqlConsoleCell[][] = Array.from({ length: limit }, () => []);
  for (let c = 0; c < fields.length; c++) {
    const temporal = TEMPORAL_TYPE_IDS.has(fields[c].typeId);
    const vector = table.getChildAt(c);
    for (let r = 0; r < limit; r++) {
      rows[r].push(toConsoleCell(vector?.get(r), temporal));
    }
  }

  return { columns, rows, totalRows, elapsedMs };
}

async function resetDatabase() {
  if (conn) {
    await conn.close();
    conn = null;
  }
  if (db) {
    await db.terminate();
    db = null;
  }
}

async function ingestFiles(
  files: Array<{ name: string; buffer: ArrayBuffer }>,
): Promise<FileSchemaInfo[]> {
  const connection = await ensureDb();
  const schemas: FileSchemaInfo[] = [];

  for (const file of files) {
    const vfsName = toVfsName(file.name);
    const fileType = detectFileType(file.name);
    const slug = toTableSlug(fileType);
    const rawTable = `raw_${slug}_${schemas.filter((s) => s.fileType === fileType).length}`;

    await db!.registerFileBuffer(vfsName, new Uint8Array(file.buffer));
    await exec(
      `CREATE OR REPLACE TABLE ${rawTable} AS SELECT * FROM read_csv_auto('${vfsName}', header = true, ignore_errors = true)`,
    );

    const columns = await runQuery<{
      column_name: string;
      column_type: string;
    }>(`DESCRIBE ${rawTable}`);

    const countRows = await runQuery<{ count: number }>(
      `SELECT COUNT(*)::INTEGER AS count FROM ${rawTable}`,
    );

    const mappings = buildColumnMappings(fileType, columns);
    const missingRequired = getMissingRequiredFields(fileType, mappings);

    schemas.push({
      originalName: file.name,
      vfsName,
      fileType,
      rawTable,
      rowCount: countRows[0]?.count ?? 0,
      columns,
      mappings,
      missingRequired,
    });
  }

  void connection;
  return schemas;
}

async function createViews(schemas: FileSchemaInfo[]) {
  const orderViews: string[] = [];
  const refundViews: string[] = [];

  for (const schema of schemas) {
    const viewName = canonicalViewName(schema.fileType);
    const sql = buildCanonicalViewSql(
      schema.fileType,
      schema.rawTable,
      viewName,
      schema.mappings,
    );
    if (!sql) continue;

    await exec(sql);

    if (ORDER_VIEW_TYPES.includes(schema.fileType)) {
      orderViews.push(viewName);
    }
    if (REFUND_VIEW_TYPES.includes(schema.fileType)) {
      refundViews.push(viewName);
    }
  }

  const allOrdersSql = buildAllOrdersViewSql(orderViews);
  if (allOrdersSql) await exec(allOrdersSql);

  const allRefundsSql = buildAllRefundsViewSql(refundViews);
  if (allRefundsSql) await exec(allRefundsSql);
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, ...request } = event.data;
  try {
    switch (request.type) {
      case "init":
        await ensureDb();
        post(id, { type: "ready", id });
        break;
      case "reset":
        await resetDatabase();
        post(id, { type: "ready", id });
        break;
      case "ingest": {
        const schemas = await ingestFiles(request.files);
        post(id, { type: "ingested", id, schemas });
        break;
      }
      case "createViews":
        await createViews(request.schemas);
        post(id, { type: "viewsCreated", id });
        break;
      case "query": {
        const rows = await runQuery(request.sql);
        post(id, { type: "queryResult", id, rows });
        break;
      }
      case "sqlConsole": {
        const data = await runConsoleQuery(request.sql);
        post(id, { type: "sqlConsoleResult", id, data });
        break;
      }
      default:
        post(id, { type: "error", id, message: "Unknown worker request" });
    }
  } catch (error) {
    post(id, {
      type: "error",
      id,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};