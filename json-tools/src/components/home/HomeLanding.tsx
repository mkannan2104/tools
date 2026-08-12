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
          <p className={styles.lead}>Simple, fast JSON tools for developers.</p>
          <p className={styles.support}>
            Format, validate, minify, compare, repair, and convert JSON directly
            in your browser.
          </p>
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
            Popular JSON Tools
          </h2>

          {filtered.length > 0 ? (
            <div className={styles.toolGrid}>
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
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
            Why use JSON Tools?
          </h2>
          <p className={styles.whyLine}>
            Fast • Free • Browser-based • No registration
          </p>
          <ul className={styles.whyList}>
            <li>
              <strong>Fast</strong> — Process your JSON directly in your
              browser.
            </li>
            <li>
              <strong>Free</strong> — Use the tools without registration or
              payment.
            </li>
            <li>
              <strong>Private</strong> — Your JSON is processed locally in your
              browser.
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.aboutSection} aria-labelledby="about-heading">
        <div className="container">
          <h2 id="about-heading" className={styles.sectionTitle}>
            JSON Tools for Developers
          </h2>
          <p>
            JSON Tools provides simple browser-based utilities for developers
            working with JSON data. Format, validate, minify, compare, repair,
            and convert JSON without installing additional software.
          </p>
        </div>
      </section>
    </>
  );
}
