import type { Metadata } from "next";
import { CsvToJsonTool } from "@/components/tools/CsvToJsonTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("csv-to-json")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function CsvToJsonPage() {
  return (
    <ToolPageShell slug="csv-to-json">
      <CsvToJsonTool />
    </ToolPageShell>
  );
}
