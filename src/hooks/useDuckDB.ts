import { useCallback, useEffect, useRef, useState } from "react";
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
  // Retained so "Reset data" can rebuild everything from the original files
  // (e.g. after a stray write in the SQL console). Never leaves the browser.
  const filesRef = useRef<File[]>([]);

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
      // Retain only a known-good set: a failed ingest must not overwrite the
      // last dataset that "Reset data" can restore.
      filesRef.current = files;
      return ingested;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setStatus("error");
      throw err;
    }
  }, []);

  const resetData = useCallback(async () => {
    const files = filesRef.current;
    if (files.length === 0) return;
    // Re-read the retained files BEFORE the DB is wiped. If the OS can no
    // longer read them (moved/deleted since upload), abort with the working
    // dataset intact rather than destroying it mid-reset.
    try {
      await Promise.all(files.map((file) => file.arrayBuffer()));
    } catch {
      throw new Error(
        "Couldn't re-read your original files — they may have been moved or changed since upload. Your data is untouched; re-upload to start fresh.",
      );
    }
    await uploadFiles(files);
  }, [uploadFiles]);

  const hasOrderData = schemas.some((schema) =>
    ORDER_FILE_TYPES.includes(schema.fileType),
  );

  return {
    status,
    error,
    schemas,
    hasOrderData,
    uploadFiles,
    resetData,
  };
}