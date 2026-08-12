import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "About - JSON Tools";
const description =
  "Learn about JSON Tools, a free open-source browser-based collection of utilities for formatting, validating, converting, and working with JSON.";

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
        {siteConfig.name} provides free, useful, browser-based utilities for
        developers to format, validate, convert, compare, and work with JSON.
        The project is released as open source under the {siteConfig.license}{" "}
        License.
      </p>

      <h2>What we build</h2>
      <p>
        The goal is a simple developer utility website: fast tools, clean pages,
        and local processing. There are no accounts, subscriptions, or backend
        APIs required to use the tools.
      </p>

      <h2>Privacy-first processing</h2>
      <p>
        Tool operations run in your browser. Your JSON is not uploaded to our
        servers for normal formatting, validation, conversion, or comparison.
      </p>

      <h2>Who it is for</h2>
      <ul>
        <li>Software developers</li>
        <li>API engineers</li>
        <li>QA and DevOps engineers</li>
        <li>Students and technical learners</li>
      </ul>

      <h2>Open source &amp; consent</h2>
      <p>
        {siteConfig.name} is open source ({siteConfig.license}). You may use,
        study, and build on it under the terms of the license. If you need
        permission, attribution guidance, or have any consent-related question
        about reuse of this project, please contact us.
      </p>

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
