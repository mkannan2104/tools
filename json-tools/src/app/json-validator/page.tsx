import type { Metadata } from "next";
import { JsonValidatorTool } from "@/components/tools/JsonValidatorTool";
import { ToolPageShell } from "@/components/tool/ToolPageShell";
import { getToolBySlug } from "@/config/tools";
import { createPageMetadata } from "@/lib/seo";

const tool = getToolBySlug("json-validator")!;

export const metadata: Metadata = createPageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
});

export default function JsonValidatorPage() {
  return (
    <ToolPageShell slug="json-validator">
      <JsonValidatorTool />
    </ToolPageShell>
  );
}
