import Papa from "papaparse";

export function csvToJson(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Please enter CSV to convert.");
  }

  const result = Papa.parse<Record<string, string>>(trimmed, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    const first = result.errors[0];
    throw new Error(first.message || "Could not parse CSV.");
  }

  if (!result.meta.fields || result.meta.fields.length === 0) {
    throw new Error("CSV must include a header row.");
  }

  return JSON.stringify(result.data, null, 2);
}
