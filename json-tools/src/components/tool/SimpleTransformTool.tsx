"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { useScrollToResults } from "@/lib/useScrollToResults";

export function SimpleTransformTool({
  inputLabel,
  outputLabel,
  placeholder,
  actionLabel,
  filename,
  mimeType,
  transform,
  secondaryActionLabel,
  secondaryTransform,
  errorTitle = "Error",
}: {
  inputLabel: string;
  outputLabel: string;
  placeholder: string;
  actionLabel: string;
  filename: string;
  mimeType?: string;
  transform: (input: string) => string;
  secondaryActionLabel?: string;
  secondaryTransform?: (input: string) => string;
  errorTitle?: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { resultsRef, requestScroll } = useScrollToResults(Boolean(error));

  function run(fn: (value: string) => string) {
    try {
      const result = fn(input);
      setOutput(result);
      setError(null);
    } catch (err) {
      requestScroll();
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setError(null);
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={() => run(transform)}
          disabled={!input.trim()}
        >
          {actionLabel}
        </Button>
        {secondaryActionLabel && secondaryTransform ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => run(secondaryTransform)}
            disabled={!input.trim()}
          >
            {secondaryActionLabel}
          </Button>
        ) : null}
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="tool-workspace two-col">
        <ToolEditor
          id="tool-input"
          label={inputLabel}
          value={input}
          placeholder={placeholder}
          onChange={(event) => setInput(event.target.value)}
        />
        <ToolOutput
          title={outputLabel}
          value={output}
          filename={filename}
          mimeType={mimeType}
        />
      </div>

      <div ref={resultsRef} className="tool-results-anchor" tabIndex={-1}>
        {error ? (
          <div className="tool-error" role="alert" id="json-error">
            <strong>{errorTitle}</strong>
            {error}
          </div>
        ) : null}
      </div>

      <p className="privacy-note">
        Processing happens locally in your browser. Do not paste passwords, API
        keys, or confidential data.
      </p>
    </div>
  );
}
