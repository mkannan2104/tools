import type { Metadata } from "next";
import { HomeLanding } from "@/components/home/HomeLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { tools } from "@/config/tools";
import { homePageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const homeTitle = "JSON Tools - Free Online JSON Developer Tools";
const homeDescription =
  "Free online JSON tools for formatting, validation, minification, comparison and conversion.";

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
