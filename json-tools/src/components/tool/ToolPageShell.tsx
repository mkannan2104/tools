import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { ToolSeoContent } from "@/components/tool/ToolSeoContent";
import { getRelatedTools, getToolBySlug } from "@/config/tools";
import { toolPageSchema } from "@/lib/schema";

export function ToolPageShell({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const related = getRelatedTools(slug);

  return (
    <div className="container tool-page">
      <JsonLd data={toolPageSchema(tool)} />
      <header className="tool-header">
        <h1>{tool.name}</h1>
        <p>{tool.seoDescription}</p>
      </header>

      {children}

      <ToolSeoContent tool={tool} />
      <RelatedTools tools={related} />
    </div>
  );
}
