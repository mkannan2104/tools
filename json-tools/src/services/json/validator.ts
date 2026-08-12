import { enrichParseError } from "@/services/json/errors";
import type { ToolError } from "@/types/tool";

export function validateJson(input: string): {
  valid: boolean;
  error: ToolError | null;
} {
  if (!input.trim()) {
    return {
      valid: false,
      error: { message: "Please enter JSON to validate." },
    };
  }

  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (error) {
    return {
      valid: false,
      error: enrichParseError(input, error),
    };
  }
}
