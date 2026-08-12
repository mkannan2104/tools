import { CopyButton } from "@/components/common/CopyButton";
import { DownloadButton } from "@/components/common/DownloadButton";
import type { ReactNode } from "react";

export function ToolOutput({
  title,
  value,
  emptyText = "Result will appear here...",
  filename,
  mimeType,
  showDownload = true,
  children,
}: {
  title: string;
  value: string;
  emptyText?: string;
  filename?: string;
  mimeType?: string;
  showDownload?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__title">{title}</span>
        <div className="panel__actions">
          <CopyButton value={value} size="sm" />
          {showDownload && filename ? (
            <DownloadButton
              value={value}
              filename={filename}
              mimeType={mimeType}
              size="sm"
            />
          ) : null}
        </div>
      </div>
      <div className="panel__body">
        {children ?? (
          <pre className="output" data-empty={value ? "false" : "true"}>
            {value || emptyText}
          </pre>
        )}
      </div>
    </div>
  );
}
