"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { ToolOutput } from "@/components/tool/ToolOutput";
import { repairJson } from "@/services/json/repair";

export function JsonRepairTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleRepair() {
    try {
      const result = repairJson(input);
      setOutput(result.repaired);
      setNotes(result.notes);
      setError(null);
    } catch (err) {
      setOutput("");
      setNotes([]);
      setError(err instanceof Error ? err.message : "Repair failed.");
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setNotes([]);
    setError(null);
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={handleRepair}
          disabled={!input.trim()}
        >
          Repair JSON
        </Button>
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="tool-workspace two-col">
        <ToolEditor
          id="repair-input"
          label="Broken JSON"
          value={input}
          placeholder="Paste broken JSON here..."
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="repair-output-col">
          {notes.length > 0 ? (
            <div className="repair-feedback success" role="status">
              <strong>Repair notes</strong>
              <ul>
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {error ? (
            <div className="repair-feedback error" role="alert">
              <strong>Could not repair</strong>
              <span>{error}</span>
            </div>
          ) : null}

          <ToolOutput
            title="Repaired JSON"
            value={output}
            filename="repaired.json"
            mimeType="application/json;charset=utf-8"
          />
        </div>
      </div>

      <p className="privacy-note">
        Repair is conservative and local-only. Always verify repaired output
        before using it in production.
      </p>
    </div>
  );
}
