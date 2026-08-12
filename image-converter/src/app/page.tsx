import type { Metadata } from "next";
import { HomeLanding } from "@/components/home/HomeLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { tools } from "@/config/tools";
import { homePageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const homeTitle = "Image Tools - Free Online Image Utilities";
const homeDescription =
  "Simple image tools that run in your browser. Compress, resize, convert, crop, and remove metadata locally — no upload, no account.";

export const metadata: Metadata = createPageMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={homePageSchema(homeDescription)} />
      <HomeLanding tools={tools} />
    </>
  );
}
