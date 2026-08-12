import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "Privacy Policy - Image Tools";
const description =
  "Privacy Policy for Image Tools. Learn how browser-local image processing works and what information may be collected by hosting.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="container legal-page">
      <JsonLd
        data={legalPageSchema({
          title,
          description,
          path: "/privacy",
        })}
      />
      <h1>Privacy Policy</h1>
      <p className="meta">Last updated: August 11, 2026</p>

      <p>
        This Privacy Policy explains how {siteConfig.name} handles information
        when you use the website.
      </p>

      <h2>Image processing</h2>
      <p>
        Normal tool operations (compress, resize, convert, crop, and metadata
        cleanup) run locally in your browser. We do not upload or store the
        images you select in the tools on an application backend for those
        operations.
      </p>
      <p>
        You should still avoid processing highly sensitive images in any online
        tool if you are unsure about your device security or browser extensions.
      </p>

      <h2>Information we may collect</h2>
      <p>
        The website itself does not require accounts and does not intentionally
        collect personal profiles. However, standard web hosting and delivery
        infrastructure may automatically collect technical information such as:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Device and operating system information</li>
        <li>Pages requested and timestamps</li>
        <li>Referrer URL</li>
      </ul>

      <h2>Cookies and consent</h2>
      <p>
        On your first visit we show a consent banner so you can accept or reject
        non-essential cookies. Essential cookies (or local storage) may be used
        only to remember your consent choice and keep the site working.
      </p>
      <p>
        If you accept, we may use advertising and measurement cookies through
        partners such as Google AdSense. If you reject non-essential cookies,
        advertising storage and related personalization signals stay disabled
        via Google Consent Mode where applicable.
      </p>
      <p>
        You can change your choice anytime using <strong>Cookie settings</strong>{" "}
        in the site footer.
      </p>

      <h2>Analytics and advertising</h2>
      <p>
        This site may display ads through Google AdSense or similar networks.
        Those partners may use cookies or similar technologies to show ads,
        measure performance, and (with your consent) personalize advertising.
        Google&apos;s use of data is described in Google&apos;s own policies.
      </p>
      <p>
        Images you process in the tools still run locally in your browser and
        are not uploaded to our application backend for normal tool use.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy, contact{" "}
        {siteConfig.developer} at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </article>
  );
}
