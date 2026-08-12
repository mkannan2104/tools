"use client";

import { SimpleTransformTool } from "@/components/tool/SimpleTransformTool";
import { escapeJson, unescapeJson } from "@/services/json/escape";

export function JsonEscapeTool() {
  return (
    <SimpleTransformTool
      inputLabel="Original"
      outputLabel="Result"
      placeholder='Hello "World"'
      actionLabel="Escape"
      secondaryActionLabel="Unescape"
      filename="escaped.txt"
      mimeType="text/plain;charset=utf-8"
      transform={escapeJson}
      secondaryTransform={unescapeJson}
      errorTitle="Escape error"
    />
  );
}
