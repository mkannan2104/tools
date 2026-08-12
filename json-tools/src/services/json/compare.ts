import { enrichParseError } from "@/services/json/errors";
import type { JsonDifference } from "@/types/tool";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareValues(
  a: unknown,
  b: unknown,
  path: string,
  differences: JsonDifference[],
): void {
  if (Object.is(a, b)) return;

  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i += 1) {
      const nextPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= a.length) {
        differences.push({ path: nextPath, type: "added", newValue: b[i] });
      } else if (i >= b.length) {
        differences.push({ path: nextPath, type: "removed", oldValue: a[i] });
      } else {
        compareValues(a[i], b[i], nextPath, differences);
      }
    }
    return;
  }

  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      const nextPath = path ? `${path}.${key}` : key;
      const hasA = Object.prototype.hasOwnProperty.call(a, key);
      const hasB = Object.prototype.hasOwnProperty.call(b, key);

      if (!hasA) {
        differences.push({ path: nextPath, type: "added", newValue: b[key] });
      } else if (!hasB) {
        differences.push({ path: nextPath, type: "removed", oldValue: a[key] });
      } else {
        compareValues(a[key], b[key], nextPath, differences);
      }
    }
    return;
  }

  differences.push({
    path: path || "(root)",
    type: "changed",
    oldValue: a,
    newValue: b,
  });
}

export function compareJson(inputA: string, inputB: string): JsonDifference[] {
  let parsedA: unknown;
  let parsedB: unknown;

  try {
    parsedA = JSON.parse(inputA);
  } catch (error) {
    throw new Error(`JSON A: ${enrichParseError(inputA, error).message}`);
  }

  try {
    parsedB = JSON.parse(inputB);
  } catch (error) {
    throw new Error(`JSON B: ${enrichParseError(inputB, error).message}`);
  }

  const differences: JsonDifference[] = [];
  compareValues(parsedA, parsedB, "", differences);
  return differences;
}

export function formatDifferenceValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  return JSON.stringify(value, null, 2) ?? String(value);
}
