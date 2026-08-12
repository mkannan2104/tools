import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import type { ToolDefinition } from "@/types/tool";
import { absoluteUrl } from "@/lib/seo";

type JsonLd = Record<string, unknown>;

function organizationSchema(): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
  };
}

function websiteSchema(description: string): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en",
  };
}

function breadcrumbSchema(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function faqSchema(faqs: ToolDefinition["faqs"]): JsonLd | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function howToSchema(tool: ToolDefinition): JsonLd | null {
  if (!tool.howTo.length) return null;
  return {
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.seoDescription,
    step: tool.howTo.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
    })),
  };
}

export function homePageSchema(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(description),
      {
        "@type": "ItemList",
        name: `${siteConfig.name} — Popular tools`,
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: absoluteUrl(tool.path),
          description: tool.description,
        })),
      },
    ],
  };
}

export function toolPageSchema(tool: ToolDefinition): JsonLd {
  const url = absoluteUrl(tool.path);
  const graph: JsonLd[] = [
    organizationSchema(),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: tool.seoTitle,
      description: tool.seoDescription,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${url}#app` },
    },
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": `${url}#app`,
      name: tool.name,
      url,
      description: tool.seoDescription,
      applicationCategory: "BrowserApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      isAccessibleForFree: true,
      featureList: tool.howTo,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: tool.name, path: tool.path },
    ]),
  ];

  const faq = faqSchema(tool.faqs);
  if (faq) graph.push(faq);

  const howTo = howToSchema(tool);
  if (howTo) graph.push(howTo);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function legalPageSchema({
  title,
  description,
  path,
  pageType = "WebPage",
}: {
  title: string;
  description: string;
  path: string;
  pageType?: "WebPage" | "AboutPage";
}): JsonLd {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": pageType,
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: "en",
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: title.replace(` - ${siteConfig.name}`, ""), path },
      ]),
    ],
  };
}
