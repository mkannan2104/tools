import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "Disclaimer - Image Tools";
const description =
  "Disclaimer for Image Tools. Tools are provided as-is and results should be independently verified.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <article className="container legal-page">
      <JsonLd
        data={legalPageSchema({
          title,
          description,
          path: "/disclaimer",
        })}
      />
      <h1>Disclaimer</h1>
      <p className="meta">Last updated: August 11, 2026</p>

      <p>
        {siteConfig.name} provides tools for general utility purposes. Results
        should be independently verified, especially before being used in
        production or critical workflows.
      </p>

      <h2>As-is service</h2>
      <p>
        The website and all tools are provided &quot;as is&quot; without
        warranties of any kind, whether express or implied.
      </p>

      <h2>No guarantee of completeness</h2>
      <p>
        Compression, conversion, cropping, and metadata cleanup may not cover
        every edge case. Metadata removal re-encodes images to strip common
        tags; it does not claim to remove every possible metadata field from
        every format.
      </p>

      <h2>Availability</h2>
      <p>
        We do not guarantee uninterrupted availability. The website may be
        unavailable due to maintenance, hosting issues, or other reasons.
      </p>
    </article>
  );
}
