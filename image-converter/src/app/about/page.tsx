import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "About - Image Tools";
const description =
  "Learn about Image Tools, a free open-source collection of browser-based utilities for compressing, resizing, converting, cropping, and cleaning images.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="container legal-page">
      <JsonLd
        data={legalPageSchema({
          title,
          description,
          path: "/about",
          pageType: "AboutPage",
        })}
      />
      <h1>About</h1>
      <p className="meta">
        Version {siteConfig.version} · Last updated: August 11, 2026
      </p>

      <p>
        {siteConfig.name} provides free, useful, browser-based utilities to
        compress, resize, convert, crop, and remove common metadata from images.
        The project is released as open source under the {siteConfig.license}{" "}
        License.
      </p>

      <h2>What we build</h2>
      <p>
        The goal is a simple utility website: fast tools, clean pages, and local
        processing. There are no accounts, subscriptions, or backend APIs
        required to use the tools.
      </p>

      <h2>Privacy-first processing</h2>
      <p>
        Tool operations run in your browser. Your images are not uploaded to our
        servers for normal compression, resizing, conversion, cropping, or
        metadata cleanup.
      </p>

      <h2>Product limits (v1)</h2>
      <ul>
        <li>Maximum 5 images per operation</li>
        <li>Each image must be under 5 MB</li>
        <li>Supported formats: JPG, JPEG, PNG, WebP</li>
      </ul>

      <h2>Developer</h2>
      <ul>
        <li>
          <strong>Developer:</strong> {siteConfig.developer}
        </li>
        <li>
          <strong>Version:</strong> {siteConfig.version}
        </li>
        <li>
          <strong>License:</strong> {siteConfig.license}
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </li>
      </ul>
    </article>
  );
}
