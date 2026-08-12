import { enrichParseError } from "@/services/json/errors";

export type JsonIndent = 2 | 4;

export type JsonSpecification =
  | "rfc8259"
  | "rfc7159"
  | "rfc4627"
  | "ecma404"
  | "skip";

export const JSON_SPECIFICATION_OPTIONS: {
  value: JsonSpecification;
  label: string;
}[] = [
  { value: "rfc8259", label: "RFC 8259" },
  { value: "rfc7159", label: "RFC 7159" },
  { value: "rfc4627", label: "RFC 4627" },
  { value: "ecma404", label: "ECMA-404" },
  { value: "skip", label: "Skip Validation" },
];

function assertRfc4627Root(parsed: unknown): void {
  if (parsed === null || typeof parsed !== "object") {
    throw new Error(
      "RFC 4627 requires the top-level value to be an object or an array.",
    );
  }
}

export function formatJson(
  input: string,
  spaces: JsonIndent = 2,
  specification: JsonSpecification = "rfc8259",
): string {
  try {
    const parsed = JSON.parse(input);

    if (specification === "rfc4627") {
      assertRfc4627Root(parsed);
    }

    return JSON.stringify(parsed, null, spaces);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("RFC 4627 requires")
    ) {
      throw error;
    }
    const toolError = enrichParseError(input, error);
    throw new Error(toolError.message);
  }
}
