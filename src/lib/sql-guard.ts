/**
 * Read-only guard for the SQL console.
 *
 * This is protective UX, not a security boundary — everything runs in the
 * user's own browser against their own data. The guard exists to stop
 * accidental mutations; the "Reset data" button (full re-ingest from the
 * original files) is the real safety net if anything slips through.
 */

export type SqlGuardVerdict =
  | { ok: true }
  | { ok: false; reason: string };

const ALLOWED_LEADING_KEYWORDS = new Set([
  "select",
  "with",
  "from",
  "describe",
  "desc",
  "show",
  "summarize",
  "explain",
  "pivot",
  "unpivot",
  "values",
  "table",
]);

/**
 * Blocked anywhere in the statement, not just at the start: DuckDB accepts
 * `WITH cte AS (...) INSERT INTO ...` and `EXPLAIN ANALYZE <statement>`
 * actually executes the inner statement.
 */
const FORBIDDEN_KEYWORDS = [
  "insert",
  "update",
  "delete",
  "drop",
  "create",
  "alter",
  "truncate",
  "attach",
  "detach",
  "copy",
  "export",
  "import",
  "install",
  "load",
  "call",
  "set",
  "reset",
  "vacuum",
  "checkpoint",
  "merge",
  "grant",
  "revoke",
  "begin",
  "commit",
  "rollback",
  "abort",
  "use",
];

/**
 * Replace string literals ('...', $$...$$), quoted identifiers ("...") and
 * comments (-- and nested block comments) with spaces, so keyword checks
 * can't be fooled by quoted content. Unterminated quotes swallow the rest of
 * the input, which fails closed: DuckDB would reject the statement anyway.
 */
export function stripSqlLiterals(sql: string): string {
  let out = "";
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (ch === "-" && next === "-") {
      while (i < n && sql[i] !== "\n") i++;
      out += " ";
      continue;
    }

    if (ch === "/" && next === "*") {
      let depth = 1;
      i += 2;
      while (i < n && depth > 0) {
        if (sql[i] === "/" && sql[i + 1] === "*") {
          depth++;
          i += 2;
        } else if (sql[i] === "*" && sql[i + 1] === "/") {
          depth--;
          i += 2;
        } else {
          i++;
        }
      }
      out += " ";
      continue;
    }

    if (ch === "'" || ch === '"') {
      // DuckDB E-strings (E'...') honor backslash escapes, so \' does NOT
      // terminate the literal. Without this, `SELECT E'a\'' ; DROP ...`
      // keeps the scanner inside a string DuckDB has already closed and the
      // trailing statement is swallowed — the guard would wave it through.
      const prev = sql[i - 1];
      const beforePrev = sql[i - 2] ?? "";
      const isEString =
        ch === "'" &&
        (prev === "e" || prev === "E") &&
        !/[A-Za-z0-9_]/.test(beforePrev);
      i++;
      while (i < n) {
        if (isEString && sql[i] === "\\") {
          i += 2; // backslash escapes the next char inside an E-string
          continue;
        }
        if (sql[i] === ch) {
          if (sql[i + 1] === ch) {
            i += 2; // doubled quote escape ('' or "")
            continue;
          }
          i++;
          break;
        }
        i++;
      }
      out += " ";
      continue;
    }

    if (ch === "$") {
      const tag = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i));
      if (tag) {
        const end = sql.indexOf(tag[0], i + tag[0].length);
        i = end === -1 ? n : end + tag[0].length;
        out += " ";
        continue;
      }
    }

    out += ch;
    i++;
  }

  return out;
}

export function validateReadOnlySql(sql: string): SqlGuardVerdict {
  const stripped = stripSqlLiterals(sql);
  const statements = stripped
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

  if (statements.length === 0) {
    return { ok: false, reason: "Enter a query to run." };
  }
  if (statements.length > 1) {
    return { ok: false, reason: "Run one statement at a time." };
  }

  const statement = statements[0];
  const leading = /[A-Za-z_]+/
    .exec(statement.replace(/^[\s(]+/, ""))?.[0]
    ?.toLowerCase();

  if (!leading || !ALLOWED_LEADING_KEYWORDS.has(leading)) {
    return {
      ok: false,
      reason:
        "Only read queries are allowed. Start with SELECT, WITH, FROM, SHOW, DESCRIBE, SUMMARIZE, PIVOT or EXPLAIN.",
    };
  }

  const lower = statement.toLowerCase();
  for (const word of FORBIDDEN_KEYWORDS) {
    if (new RegExp(`\\b${word}\\b`).test(lower)) {
      return {
        ok: false,
        reason: `The console is read-only — "${word.toUpperCase()}" is not allowed. (If a column alias tripped this, quote it or rename it.)`,
      };
    }
  }

  return { ok: true };
}
