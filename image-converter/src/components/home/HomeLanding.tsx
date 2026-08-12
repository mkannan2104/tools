"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/home/ToolCard";
import { siteConfig } from "@/config/site";
import type { ToolDefinition } from "@/types/tool";
import styles from "./home.module.css";

export function HomeLanding({ tools }: { tools: ToolDefinition[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q),
    );
  }, [query, tools]);

  return (
    <>
      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={`container ${styles.heroInner}`}>
          <h1 id="home-heading">{siteConfig.name}</h1>
          <p className={styles.lead}>
            Simple image tools that run in your browser.
          </p>
          <p className={styles.support}>No upload. No account.</p>
          <label className={styles.search}>
            <span className="sr-only">Search tools</span>
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools..."
              autoComplete="off"
            />
          </label>
        </div>
      </section>

      <section
        id="tools"
        className={styles.toolsSection}
        aria-labelledby="popular-tools-heading"
      >
        <div className="container">
          <h2 id="popular-tools-heading" className={styles.sectionTitle}>
            Popular Image Tools
          </h2>

          {filtered.length > 0 ? (
            <div className={styles.toolGrid}>
              {filtered.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  className={
                    tool.slug === "image-metadata-remover"
                      ? styles.toolWide
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>No tools match “{query.trim()}”.</p>
          )}
        </div>
      </section>

      <section className={styles.whySection} aria-labelledby="why-heading">
        <div className="container">
          <h2 id="why-heading" className={styles.sectionTitle}>
            Why Image Tools?
          </h2>
          <p className={styles.whyLine}>
            Local browser processing · No account · Simple and free · Up to 5
            images
          </p>
          <ul className={styles.whyList}>
            <li>
              <strong>Local</strong> — Process images directly in your browser.
            </li>
            <li>
              <strong>Private</strong> — No account required; files are not
              uploaded for normal tool use.
            </li>
            <li>
              <strong>Simple limits</strong> — Up to 5 images per operation,
              each under 5 MB (JPG, PNG, WebP).
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.aboutSection} aria-labelledby="about-heading">
        <div className="container">
          <h2 id="about-heading" className={styles.sectionTitle}>
            Image Tools in your browser
          </h2>
          <p>
            Image Tools provides simple browser-based utilities for compressing,
            resizing, converting, cropping, and removing common metadata from
            images — without installing software or creating an account.
          </p>
        </div>
      </section>
    </>
  );
}
