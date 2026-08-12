"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { JsonTreeViewer } from "@/components/tool/JsonTreeViewer";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { enrichParseError } from "@/services/json/errors";

export function JsonViewerTool() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  function handleView() {
    try {
      const parsed = JSON.parse(input);
      setData(parsed);
      setError(null);
    } catch (err) {
      setData(null);
      setError(enrichParseError(input, err).message);
    }
  }

  function clear() {
    setInput("");
    setData(null);
    setError(null);
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={handleView}
          disabled={!input.trim()}
        >
          View JSON
        </Button>
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="tool-workspace two-col">
        <ToolEditor
          id="viewer-input"
          label="Input JSON"
          value={input}
          placeholder="Paste your JSON here..."
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="panel">
          {data !== null ? (
            <JsonTreeViewer data={data} />
          ) : (
            <>
              <div className="panel__header">
                <span className="panel__title">Tree view</span>
              </div>
              <div className="panel__body">
                <pre className="output" data-empty="true">
                  Tree view will appear here...
                </pre>
              </div>
            </>
          )}
        </div>
      </div>

      {error ? (
        <div className="tool-error" role="alert">
          <strong>Invalid JSON</strong>
          {error}
        </div>
      ) : null}

      <p className="privacy-note">
        The viewer renders JSON locally as text. Nothing is sent to a server.
      </p>
    </div>
  );
}
