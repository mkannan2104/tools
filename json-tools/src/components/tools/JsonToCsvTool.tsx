"use client";

import { SimpleTransformTool } from "@/components/tool/SimpleTransformTool";
import { jsonToCsv } from "@/services/csv/jsonToCsv";

export function JsonToCsvTool() {
  return (
    <SimpleTransformTool
      inputLabel="JSON"
      outputLabel="CSV"
      placeholder='[{"name":"John","age":25}]'
      actionLabel="Convert to CSV"
      filename="converted.csv"
      mimeType="text/csv;charset=utf-8"
      transform={jsonToCsv}
      errorTitle="Conversion error"
    />
  );
}
