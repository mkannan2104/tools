import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "Terms of Use - Image Tools";
const description =
  "Terms of Use for Image Tools. Acceptable use, tool limitations, and user responsibilities.";

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
        {siteConfig.name} provides free utilities for working with images in
        your browser. The tools are offered for general productivity use.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt or abuse the website</li>
        <li>Do not use the tools for unlawful purposes</li>
        <li>Do not attempt to reverse engineer or attack hosting infrastructure</li>
        <li>Do not process content you are not permitted to process</li>
      </ul>

      <h2>Tool limitations</h2>
      <p>
        Tools are practical utilities and may not handle every edge case, exotic
        container, or very large file. Output should be reviewed before use.
        Supported formats in v1 are JPG, JPEG, PNG, and WebP, with a maximum of
        5 images under 5 MB each per operation.
      </p>

      <h2>User responsibility</h2>
      <p>
        You are responsible for the images you process and for verifying any
        output before relying on it.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </article>
  );
}
