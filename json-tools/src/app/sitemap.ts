import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/privacy", "/terms", "/disclaimer"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path || "/"}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...tools.map((tool) => ({
      url: `${siteConfig.url}${tool.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
