import type { Metadata } from "next";
import { JsonToCsvTool } from "@/components/tools/JsonToCsvTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-to-csv")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonToCsvPage() {
  return (
    <ToolPageShell slug="json-to-csv">
      <JsonToCsvTool />
    </ToolPageShell>
  );
}
