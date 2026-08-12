import { ArrowRight, Braces } from "lucide-react";
import Link from "next/link";
import type { ToolDefinition } from "@/types/tool";

export function ToolCard({
  tool,
  className = "",
}: {
  tool: ToolDefinition;
  className?: string;
}) {
  return (
    <Link href={tool.path} className={`tool-card ${className}`.trim()}>
      <span className="tool-card__icon" aria-hidden="true">
        <Braces size={18} strokeWidth={2} />
      </span>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <span className="tool-card__cta">
        Open tool
        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
      </span>
    </Link>
  );
}
