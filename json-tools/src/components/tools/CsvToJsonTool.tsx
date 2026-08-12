"use client";

import { SimpleTransformTool } from "@/components/tool/SimpleTransformTool";
import { csvToJson } from "@/services/csv/csvToJson";

export function CsvToJsonTool() {
  return (
    <SimpleTransformTool
      inputLabel="CSV"
      outputLabel="JSON"
      placeholder={"name,age\nJohn,25\nJane,30"}
      actionLabel="Convert to JSON"
      filename="converted.json"
      mimeType="application/json;charset=utf-8"
      transform={csvToJson}
      errorTitle="Conversion error"
    />
  );
}
