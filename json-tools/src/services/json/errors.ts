import type { ToolError } from "@/types/tool";

export function parseJsonError(error: unknown): ToolError {
  const message = error instanceof Error ? error.message : "Invalid JSON";

  const positionMatch = message.match(/position\s+(\d+)/i);
  if (positionMatch) {
    return { message: humanizeJsonError(message) };
  }

  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    return {
      message: humanizeJsonError(message),
      line: Number(lineColMatch[1]),
      column: Number(lineColMatch[2]),
    };
  }

  return { message: humanizeJsonError(message) };
}

function humanizeJsonError(message: string): string {
  const cleaned = message.replace(/^JSON\.parse:\s*/i, "").trim();
  return cleaned || "Please check the JSON syntax.";
}

export function getLineColumnFromPosition(
  input: string,
  position: number,
): { line: number; column: number } {
  const sliced = input.slice(0, Math.max(0, position));
  const lines = sliced.split(/\r?\n/);
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  };
}

export function enrichParseError(input: string, error: unknown): ToolError {
  const base = parseJsonError(error);
  if (base.line && base.column) return base;

  const message = error instanceof Error ? error.message : "";
  const positionMatch = message.match(/position\s+(\d+)/i);
  if (!positionMatch) return base;

  const position = Number(positionMatch[1]);
  const { line, column } = getLineColumnFromPosition(input, position);
  return {
    message: `Unexpected token near line ${line}, column ${column}. Please check the JSON syntax.`,
    line,
    column,
  };
}
