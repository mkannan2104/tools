import { enrichParseError } from "@/services/json/errors";

function tryParse(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function stripComments(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function replaceSingleQuotes(input: string): string {
  return input.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (_match, content: string) => {
    const escaped = content.replace(/"/g, '\\"');
    return `"${escaped}"`;
  });
}

function removeTrailingCommas(input: string): string {
  return input.replace(/,\s*([}\]])/g, "$1");
}

function quoteUnquotedKeys(input: string): string {
  return input.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');
}

function wrapUnquotedStrings(input: string): string {
  return input.replace(
    /:\s*([A-Za-z_][A-Za-z0-9_-]*)\s*([,}\]])/g,
    (_match, value: string, ending: string) => {
      if (value === "true" || value === "false" || value === "null") {
        return `: ${value}${ending}`;
      }
      return `: "${value}"${ending}`;
    },
  );
}

function balanceBrackets(input: string): string {
  let braces = 0;
  let brackets = 0;
  let inString = false;
  let escaped = false;

  for (const char of input) {
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      braces += 1;
    } else if (char === "}") {
      braces -= 1;
    } else if (char === "[") {
      brackets += 1;
    } else if (char === "]") {
      brackets -= 1;
    }
  }

  let result = input;
  while (braces > 0) {
    result += "}";
    braces -= 1;
  }
  while (brackets > 0) {
    result += "]";
    brackets -= 1;
  }
  return result;
}

export function repairJson(input: string): {
  repaired: string;
  notes: string[];
} {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Please enter JSON to repair.");
  }

  const direct = tryParse(trimmed);
  if (direct !== null) {
    return {
      repaired: JSON.stringify(direct, null, 2),
      notes: ["JSON was already valid."],
    };
  }

  const notes: string[] = [];
  let candidate = trimmed;

  const steps: { name: string; run: (value: string) => string }[] = [
    { name: "Removed comments", run: stripComments },
    { name: "Converted single quotes to double quotes", run: replaceSingleQuotes },
    { name: "Quoted unquoted keys", run: quoteUnquotedKeys },
    { name: "Quoted unquoted string values", run: wrapUnquotedStrings },
    { name: "Removed trailing commas", run: removeTrailingCommas },
    { name: "Balanced missing brackets", run: balanceBrackets },
  ];

  for (const step of steps) {
    const next = step.run(candidate);
    if (next !== candidate) {
      notes.push(step.name);
      candidate = next;
      const parsed = tryParse(candidate);
      if (parsed !== null) {
        return {
          repaired: JSON.stringify(parsed, null, 2),
          notes,
        };
      }
    }
  }

  const finalAttempt = tryParse(candidate);
  if (finalAttempt !== null) {
    return {
      repaired: JSON.stringify(finalAttempt, null, 2),
      notes,
    };
  }

  const originalError = enrichParseError(trimmed, (() => {
    try {
      JSON.parse(trimmed);
      return new Error("Invalid JSON");
    } catch (error) {
      return error;
    }
  })());

  throw new Error(
    `Could not confidently repair this JSON. ${originalError.message}`,
  );
}
