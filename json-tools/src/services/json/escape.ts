export function escapeJson(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}

export function unescapeJson(input: string): string {
  try {
    return JSON.parse(`"${input}"`);
  } catch {
    throw new Error(
      "Could not unescape this string. Check that escape sequences are valid.",
    );
  }
}
