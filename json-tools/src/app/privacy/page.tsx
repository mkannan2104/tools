import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { legalPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const title = "Privacy Policy - JSON Tools";
const description =
  "Privacy Policy for JSON Tools. Learn how browser-local processing works and what information may be collected by hosting.";

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

      <h2>JSON processing</h2>
      <p>
        Normal tool operations (formatting, validating, minifying, converting,
        comparing, repairing, querying, and escaping JSON) run locally in your
        browser. We do not upload or store the JSON you paste into the tools on
        an application backend for those operations.
      </p>
      <p>
        You should still avoid pasting highly sensitive information such as
        passwords, API keys, authentication tokens, or confidential business
        data into any online tool.
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
      <p>
        This type of information is typically found in server or CDN access logs
        and is used for security, reliability, and basic operational purposes.
      </p>

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
        Tool content you paste or upload for processing still runs locally in
        your browser and is not uploaded to our application backend for normal
        tool use.
      </p>

      <h2>Third-party services</h2>
      <p>
        The site may be hosted or delivered through third-party infrastructure
        providers. Those providers may process technical request data under their
        own policies as needed to operate the service.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &quot;Last
        updated&quot; date at the top of this page will change when updates are
        published.
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
