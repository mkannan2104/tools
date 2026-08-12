import Link from "next/link";
import type { ToolDefinition } from "@/types/tool";

export function RelatedTools({ tools }: { tools: ToolDefinition[] }) {
  if (tools.length === 0) return null;

  return (
    <section className="content-block">
      <h2>Related Tools</h2>
      <div className="related-grid">
        {tools.map((tool) => (
          <Link key={tool.slug} href={tool.path} className="related-link">
            <strong>{tool.name}</strong>
            <span>{tool.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
