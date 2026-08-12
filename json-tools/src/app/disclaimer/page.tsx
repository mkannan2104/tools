import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "Disclaimer - JSON Tools";
const description =
  "Disclaimer for JSON Tools. Tools are provided as-is and results should be independently verified.";

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
        {siteConfig.name} provides tools for general developer utility purposes.
        Results should be independently verified, especially before being used
        in production or critical systems.
      </p>

      <h2>As-is service</h2>
      <p>
        The website and all tools are provided &quot;as is&quot; without
        warranties of any kind, whether express or implied.
      </p>

      <h2>No guarantee of correctness</h2>
      <p>
        We do not guarantee that formatting, validation, conversion, comparison,
        repair, query, or escape results are always accurate. Always review
        output carefully.
      </p>

      <h2>Availability</h2>
      <p>
        We do not guarantee uninterrupted availability. The website may be
        unavailable due to maintenance, hosting issues, or other reasons.
      </p>

      <h2>Not professional advice</h2>
      <p>
        This website is a developer utility, not a substitute for professional
        software engineering review, security review, or legal advice.
      </p>
    </article>
  );
}
