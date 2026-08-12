"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { queryJson } from "@/services/json/query";

export function JsonQueryTool() {
  const [input, setInput] = useState("");
  const [path, setPath] = useState("users[0].name");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleQuery() {
    try {
      const result = queryJson(input, path);
      setOutput(JSON.stringify(result, null, 2));
      setError(null);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Query failed.");
    }
  }

  function clear() {
    setInput("");
    setPath("");
    setOutput("");
    setError(null);
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={handleQuery}
          disabled={!input.trim() || !path.trim()}
        >
          Run Query
        </Button>
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="query-field">
        <label htmlFor="json-path">Query path</label>
        <input
          id="json-path"
          value={path}
          onChange={(event) => setPath(event.target.value)}
          placeholder="users[0].name"
        />
      </div>

      <div className="tool-workspace two-col">
        <ToolEditor
          id="query-input"
          label="JSON Input"
          value={input}
          placeholder='{"users":[{"name":"John"}]}'
          onChange={(event) => setInput(event.target.value)}
        />
        <ToolOutput
          title="Result"
          value={output}
          filename="query-result.json"
          mimeType="application/json;charset=utf-8"
        />
      </div>

      {error ? (
        <div className="tool-error" role="alert">
          <strong>Query error</strong>
          {error}
        </div>
      ) : null}

      <p className="privacy-note">
        Supported paths include property access and indexes, for example{" "}
        <code>users[0].name</code>. Queries run locally.
      </p>
    </div>
  );
}
