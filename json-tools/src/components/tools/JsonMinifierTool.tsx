"use client";

import { SimpleTransformTool } from "@/components/tool/SimpleTransformTool";
import { minifyJson } from "@/services/json/minifier";

export function JsonMinifierTool() {
  return (
    <SimpleTransformTool
      inputLabel="Input JSON"
      outputLabel="Minified JSON"
      placeholder="Paste your JSON here..."
      actionLabel="Minify JSON"
      filename="minified.json"
      mimeType="application/json;charset=utf-8"
      transform={minifyJson}
      errorTitle="Invalid JSON"
    />
  );
}
