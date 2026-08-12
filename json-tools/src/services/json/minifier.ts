import { enrichParseError } from "@/services/json/errors";

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    const toolError = enrichParseError(input, error);
    throw new Error(toolError.message);
  }
}
