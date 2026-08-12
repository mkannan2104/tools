"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/#tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    document.body.classList.add("nav-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="container site-header__inner">
        <Link
          href="/"
          className="brand-link"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setOpen(false)}
        >
          <BrandLogo />
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X size={18} strokeWidth={2} />
          ) : (
            <Menu size={18} strokeWidth={2} />
          )}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`nav-mobile${open ? " open" : ""}`}
        hidden={!open}
      >
        <div className="container">
          <nav aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/disclaimer" onClick={() => setOpen(false)}>
              Disclaimer
            </Link>
          </nav>
        </div>
      </div>

      {open ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
