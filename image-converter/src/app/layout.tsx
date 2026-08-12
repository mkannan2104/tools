import type { Metadata } from "next";
import Script from "next/script";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/config/site";
import "./globals.css";

const consentBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  var raw = localStorage.getItem('site-consent-v1');
  if (raw) {
    var parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && (parsed.status === 'accepted' || parsed.status === 'rejected')) {
      var value = parsed.status === 'accepted' ? 'granted' : 'denied';
      gtag('consent', 'update', {
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
        analytics_storage: value
      });
    }
  }
} catch (e) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Free Online Image Utilities`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "image tools",
    "image compressor",
    "image resizer",
    "image converter",
    "image cropper",
    "remove image metadata",
    "compress images online",
  ],
  authors: [{ name: siteConfig.developer }],
  creator: siteConfig.developer,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Free Online Image Utilities`,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Free Online Image Utilities`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: consentBootstrap }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
