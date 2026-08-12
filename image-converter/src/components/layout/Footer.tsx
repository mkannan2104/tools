import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";

export function Footer() {
  const featured = tools.slice(0, 4);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand-link" aria-label={`${siteConfig.name} home`}>
              <BrandLogo />
            </Link>
            <p>Simple image tools that run in your browser.</p>
            <p className="footer-meta">
              v{siteConfig.version} · Open source ({siteConfig.license})
            </p>
          </div>

          <div className="footer-links">
            <h3>Tools</h3>
            {featured.map((tool) => (
              <Link key={tool.slug} href={tool.path}>
                {tool.name}
              </Link>
            ))}
            <Link href="/#tools">All tools</Link>
          </div>

          <div className="footer-links">
            <h3>Legal</h3>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <CookieSettingsButton />
          </div>
        </div>

        <div className="footer-bottom">
          © {siteConfig.year} {siteConfig.name}. Developed by{" "}
          {siteConfig.developer}.{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
      </div>
    </footer>
  );
}
