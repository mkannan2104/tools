import { enrichParseError } from "@/services/json/errors";

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text: string;
  if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function jsonToCsv(input: string): string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new Error(enrichParseError(input, error).message);
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON to CSV expects an array of objects.");
  }

  if (parsed.length === 0) {
    return "";
  }

  if (!parsed.every((item) => typeof item === "object" && item !== null && !Array.isArray(item))) {
    throw new Error("JSON to CSV expects an array of objects.");
  }

  const rows = parsed as Record<string, unknown>[];
  const headers: string[] = [];
  const headerSet = new Set<string>();

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!headerSet.has(key)) {
        headerSet.add(key);
        headers.push(key);
      }
    }
  }

  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  return lines.join("\n");
}
