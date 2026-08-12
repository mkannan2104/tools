"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { useScrollToResults } from "@/lib/useScrollToResults";
import {
  compareJson,
  formatDifferenceValue,
} from "@/services/json/compare";
import type { JsonDifference } from "@/types/tool";

export function JsonCompareTool() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [differences, setDifferences] = useState<JsonDifference[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resultsRef, requestScroll } = useScrollToResults(
    differences !== null || Boolean(error),
  );

  function handleCompare() {
    requestScroll();
    try {
      const result = compareJson(inputA, inputB);
      setDifferences(result);
      setError(null);
    } catch (err) {
      setDifferences(null);
      setError(err instanceof Error ? err.message : "Compare failed.");
    }
  }

  function clear() {
    setInputA("");
    setInputB("");
    setDifferences(null);
    setError(null);
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={handleCompare}
          disabled={!inputA.trim() || !inputB.trim()}
        >
          Compare
        </Button>
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="tool-workspace two-col">
        <ToolEditor
          id="compare-a"
          label="JSON A"
          value={inputA}
          placeholder="Paste first JSON..."
          onChange={(event) => setInputA(event.target.value)}
        />
        <ToolEditor
          id="compare-b"
          label="JSON B"
          value={inputB}
          placeholder="Paste second JSON..."
          onChange={(event) => setInputB(event.target.value)}
        />
      </div>

      <div ref={resultsRef} className="tool-results-anchor" tabIndex={-1}>
        {error ? (
          <div className="tool-error" role="alert">
            <strong>Could not compare</strong>
            {error}
          </div>
        ) : null}

        {differences ? (
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel__header">
              <span className="panel__title">Differences</span>
            </div>
            <div className="diff-list">
              {differences.length === 0 ? (
                <div>No differences found. The JSON documents are equal.</div>
              ) : (
                differences.map((diff) => (
                  <div
                    key={`${diff.type}-${diff.path}`}
                    className={`diff-item ${diff.type}`}
                  >
                    <span className="diff-label">{diff.type}</span>
                    <div>{diff.path}</div>
                    {diff.type === "changed" ? (
                      <div>
                        {formatDifferenceValue(diff.oldValue)} →{" "}
                        {formatDifferenceValue(diff.newValue)}
                      </div>
                    ) : null}
                    {diff.type === "added" ? (
                      <div>{formatDifferenceValue(diff.newValue)}</div>
                    ) : null}
                    {diff.type === "removed" ? (
                      <div>{formatDifferenceValue(diff.oldValue)}</div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>

      <p className="privacy-note">
        Comparison runs locally in your browser and never uploads your JSON.
      </p>
    </div>
  );
}
