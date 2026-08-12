"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { ToolEditor } from "@/components/tool/ToolEditor";
import { useScrollToResults } from "@/lib/useScrollToResults";
import { validateJson } from "@/services/json/validator";

export function JsonValidatorTool() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [message, setMessage] = useState("");
  const { resultsRef, requestScroll } = useScrollToResults(status !== "idle");

  function handleValidate() {
    requestScroll();
    const result = validateJson(input);
    if (result.valid) {
      setStatus("valid");
      setMessage("Valid JSON");
      return;
    }
    setStatus("invalid");
    setMessage(result.error?.message ?? "Invalid JSON");
  }

  function clear() {
    setInput("");
    setStatus("idle");
    setMessage("");
  }

  return (
    <div>
      <div className="tool-toolbar">
        <Button
          variant="primary"
          size="sm"
          onClick={handleValidate}
          disabled={!input.trim()}
        >
          Validate JSON
        </Button>
        <Button size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="tool-workspace">
        <ToolEditor
          id="validator-input"
          label="JSON Input"
          value={input}
          placeholder="Paste your JSON here..."
          onChange={(event) => setInput(event.target.value)}
          aria-describedby={status === "invalid" ? "json-error" : undefined}
        />
      </div>

      <div ref={resultsRef} className="tool-results-anchor" tabIndex={-1}>
        {status !== "idle" ? (
          <div
            className={`tool-status ${status === "valid" ? "success" : "error"}`}
            role="status"
            id="json-error"
          >
            <strong className="tool-status__title">
              {status === "valid" ? (
                <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <XCircle size={16} strokeWidth={2} aria-hidden="true" />
              )}
              {status === "valid" ? "Valid JSON" : "Invalid JSON"}
            </strong>
            <div>{message}</div>
          </div>
        ) : null}
      </div>

      <p className="privacy-note">
        Validation runs locally in your browser. Your JSON is not uploaded.
      </p>
    </div>
  );
}
