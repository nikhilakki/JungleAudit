import { useCallback, useEffect, useState } from "react";
import {
  createCanonicalViews,
  initDuckDB,
  ingestFiles,
  resetDuckDB,
} from "@/lib/duckdb";
import type { FileSchemaInfo } from "@/lib/schema";
import { ORDER_FILE_TYPES } from "@/lib/schema";

export type AppStatus =
  | "idle"
  | "initializing"
  | "ingesting"
  | "ready"
  | "error";

export function useDuckDB() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [schemas, setSchemas] = useState<FileSchemaInfo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setStatus("initializing");
      try {
        await initDuckDB();
        if (!cancelled) setStatus("idle");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    setStatus("ingesting");
    setError(null);
    try {
      await resetDuckDB();
      await initDuckDB();
      const ingested = await ingestFiles(files);
      await createCanonicalViews(ingested);
      setSchemas(ingested);
      setStatus("ready");
      return ingested;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setStatus("error");
      throw err;
    }
  }, []);

  const hasOrderData = schemas.some((schema) =>
    ORDER_FILE_TYPES.includes(schema.fileType),
  );

  return {
    status,
    error,
    schemas,
    hasOrderData,
    uploadFiles,
  };
}