"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "../../lib/showcase";

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="OmniGraph home">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M5 8h9v9H5zM18 15h9v9h-9zM14 12h8v3M10 17v7h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span>OmniGraph</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="page-width header-row">
        <Logo />
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-action" href="/contact">
          Talk to sales <ArrowUpRight size={15} />
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const current = navigation.find((item) => item.href === pathname);
  return (
    <div className="page-width breadcrumb-row">
      <nav aria-label="Breadcrumb">
        <Link href="/">Software</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{current?.label ?? "Page"}</span>
      </nav>
      <span className="mono">OMNIGRAPH / TECHNICAL BRIEF</span>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width">
        <div className="footer-top">
          <p>
            Structure the data.
            <br />
            Follow the relationships.
          </p>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </nav>
          <div className="footer-meta mono">
            DETERMINISTIC HYBRID PROCESSING
            <br />
            LOCAL EXECUTION / CONNECTED KNOWLEDGE
            <br />
            <br />© 2026 OMNIGRAPH
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          OmniGraph<span>↗</span>
        </div>
      </div>
    </footer>
  );
}
