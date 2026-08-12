import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "Terms of Use - JSON Tools";
const description =
  "Terms of Use for JSON Tools. Acceptable use, tool limitations, and user responsibilities.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="container legal-page">
      <JsonLd
        data={legalPageSchema({
          title,
          description,
          path: "/terms",
        })}
      />
      <h1>Terms of Use</h1>
      <p className="meta">Last updated: August 11, 2026</p>

      <p>
        By using {siteConfig.name}, you agree to these Terms of Use. If you do
        not agree, please do not use the website.
      </p>

      <h2>Website usage</h2>
      <p>
        {siteConfig.name} provides free developer utilities for working with
        JSON and related text formats. The tools are offered for general
        productivity and educational use.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt or abuse the website</li>
        <li>Do not use the tools for unlawful purposes</li>
        <li>Do not attempt to reverse engineer or attack hosting infrastructure</li>
        <li>Do not upload or paste content you are not permitted to process</li>
      </ul>

      <h2>Tool limitations</h2>
      <p>
        Tools are provided as practical utilities and may not handle every edge
        case, malformed document, or complex nested structure. Output should be
        reviewed before use in production systems.
      </p>

      <h2>No guarantee of results</h2>
      <p>
        We do not guarantee that results will always be correct, complete, or
        suitable for a particular purpose. Repair, conversion, and query tools
        in particular can produce incomplete or unexpected output depending on
        the input.
      </p>

      <h2>User responsibility</h2>
      <p>
        You are responsible for the data you paste into the tools and for
        verifying any output before relying on it. Do not paste highly sensitive
        credentials or confidential information.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The website design, branding, and original content belong to the site
        operator unless otherwise stated. You retain rights to the data you
        process locally in your browser.
      </p>

      <h2>Changes to the service</h2>
      <p>
        Features may be added, changed, or removed at any time. These Terms may
        also be updated periodically.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms can be sent through the contact method
        published with the live domain.
      </p>
    </article>
  );
}
