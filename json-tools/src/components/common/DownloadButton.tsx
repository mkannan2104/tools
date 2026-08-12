"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/common/Button";
import { downloadTextFile } from "@/services/browser/download";

export function DownloadButton({
  value,
  filename,
  mimeType,
  disabled,
  size = "md",
}: {
  value: string;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
  size?: "md" | "sm";
}) {
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <Button
      size={size}
      onClick={() => downloadTextFile(value, filename, mimeType)}
      disabled={disabled || !value}
      aria-label="Download"
    >
      <Download size={iconSize} strokeWidth={2} />
      <span>Download</span>
    </Button>
  );
}
