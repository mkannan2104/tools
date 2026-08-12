export const siteConfig = {
  name: "JSON Tools",
  shortName: "JSON Tools",
  version: "1.0.0",
  description:
    "Simple, fast and free JSON tools for developers. Format, validate, minify, convert and work with JSON directly in your browser.",
  tagline: "Simple, fast and free JSON tools for developers.",
  supportingText:
    "Format, validate, minify, convert and work with JSON directly in your browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jsontools.cloud",
  year: new Date().getFullYear(),
  developer: "Mugesh Kannan",
  email: "ops.devsupport@gmail.com",
  license: "MIT",
  analyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "G-6XCH9M72RL",
} as const;
