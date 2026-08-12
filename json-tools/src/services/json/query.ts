import { enrichParseError } from "@/services/json/errors";

function tokenizePath(path: string): Array<string | number> {
  const tokens: Array<string | number> = [];
  const regex = /([^[.\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(path)) !== null) {
    if (match[1]) {
      tokens.push(match[1]);
    } else if (match[2]) {
      tokens.push(Number(match[2]));
    }
  }

  return tokens;
}

export function queryJson(input: string, path: string): unknown {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new Error(enrichParseError(input, error).message);
  }

  const trimmedPath = path.trim();
  if (!trimmedPath || trimmedPath === "$" || trimmedPath === ".") {
    return parsed;
  }

  const normalized = trimmedPath.replace(/^\$\.?/, "");
  const tokens = tokenizePath(normalized);

  if (tokens.length === 0) {
    throw new Error("Path not found. Use a path like users[0].name.");
  }

  let current: unknown = parsed;

  for (const token of tokens) {
    if (current === null || current === undefined) {
      throw new Error("Path not found");
    }

    if (typeof token === "number") {
      if (!Array.isArray(current) || token < 0 || token >= current.length) {
        throw new Error("Path not found");
      }
      current = current[token];
      continue;
    }

    if (typeof current !== "object" || Array.isArray(current)) {
      throw new Error("Path not found");
    }

    const record = current as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(record, token)) {
      throw new Error("Path not found");
    }
    current = record[token];
  }

  return current;
}
