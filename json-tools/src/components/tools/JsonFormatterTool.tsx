"use client";

import { Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/common/Button";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { ToolOutput } from "@/components/tool/ToolOutput";
import {
  formatJson,
  JSON_SPECIFICATION_OPTIONS,
  type JsonIndent,
  type JsonSpecification,
} from "@/services/json/formatter";

export function JsonFormatterTool() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<JsonIndent>(2);
  const [specification, setSpecification] =
    useState<JsonSpecification>("rfc8259");

  function handleFormat() {
    try {
      setOutput(formatJson(input, indent, specification));
      setError(null);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setInput(text);
      setError(null);
    };
    reader.onerror = () => {
      setError("Could not read the selected file.");
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={handleFormat}
          disabled={!input.trim()}
        >
          Format JSON
        </Button>
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="tool-workspace two-col">
        <ToolEditor
          id="formatter-input"
          label="Input JSON"
          value={input}
          placeholder='{"name":"John","age":25}'
          onChange={(event) => setInput(event.target.value)}
          actions={
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,application/json,text/plain"
                className="sr-only"
                onChange={handleFileChange}
              />
              <Button size="sm" onClick={handleImportClick}>
                <Upload size={14} strokeWidth={2} aria-hidden="true" />
                Import
              </Button>
              <label className="panel-control">
                <span className="sr-only">Spaces</span>
                <select
                  value={indent}
                  onChange={(event) =>
                    setIndent(Number(event.target.value) as JsonIndent)
                  }
                  aria-label="Indentation spaces"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </label>
              <label className="panel-control">
                <span className="sr-only">JSON Specification</span>
                <select
                  value={specification}
                  onChange={(event) =>
                    setSpecification(event.target.value as JsonSpecification)
                  }
                  aria-label="JSON Specification"
                >
                  {JSON_SPECIFICATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          }
        />
        <ToolOutput
          title="Formatted JSON"
          value={output}
          filename="formatted.json"
          mimeType="application/json;charset=utf-8"
        />
      </div>

      {error ? (
        <div className="tool-error" role="alert" id="json-error">
          <strong>Invalid JSON</strong>
          {error}
        </div>
      ) : null}

      <p className="privacy-note">
        Processing happens locally in your browser. Do not paste passwords, API
        keys, or confidential data.
      </p>
    </div>
  );
}
