"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { copyToClipboard } from "@/services/browser/clipboard";

export function CopyButton({
  value,
  disabled,
  size = "md",
}: {
  value: string;
  disabled?: boolean;
  size?: "md" | "sm";
}) {
  const [copied, setCopied] = useState(false);
  const iconSize = size === "sm" ? 14 : 16;

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      size={size}
      onClick={handleCopy}
      disabled={disabled || !value}
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check size={iconSize} strokeWidth={2} /> : <Copy size={iconSize} strokeWidth={2} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
