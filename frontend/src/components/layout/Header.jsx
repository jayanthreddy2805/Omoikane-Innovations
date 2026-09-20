"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

// ─── Search index — all searchable pages ──────────────────────────
const SEARCH_INDEX = [
  { title: "Home", desc: "Omoikane Innovations — Aerospace, Defense & Embedded Systems", href: "/" },
  { title: "About Us", desc: "Learn about Omoikane Innovations, our mission and history", href: "/about" },
  { title: "Technologies", desc: "Our advanced technology stack and engineering capabilities", href: "/technologies" },
  { title: "Projects", desc: "Real-world projects and deployments by Omoikane", href: "/projects" },
  { title: "Industries", desc: "Industries we serve: Defense, Agriculture, Aerospace", href: "/industries" },
  { title: "Leadership", desc: "Meet the leadership team at Omoikane Innovations", href: "/leadership" },
  { title: "Contact", desc: "Get in touch with the Omoikane team", href: "/contact" },
  { title: "Software Development Careers", desc: "React, Next.js, Python, AI Developer, Embedded Firmware roles", href: "/careers/software" },
  { title: "Mechanical Careers", desc: "CAD, structural analysis, assembly engineering roles", href: "/careers/mechanical" },
  { title: "Electronics Careers", desc: "Hardware, RF & embedded systems engineering roles", href: "/careers/electronics" },
  { title: "Careers", desc: "Join the Omoikane engineering team", href: "/careers" },
];

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Expertise", href: "/expertise" },
  { label: "Our Work", href: "/work" },
  { label: "Leadership", href: "/leadership" },
  {
    label: "Careers",
    href: "/careers",
    dropdown: [
      { title: "Software Development", desc: "Software, AI & real-time systems", href: "/careers/software" },
      { title: "Mechanical", desc: "Product, structures & integration", href: "/careers/mechanical" },
      { title: "Electronics", desc: "Hardware, RF & embedded systems", href: "/careers/electronics" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [careersOpen, setCareersOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const searchInputRef = React.useRef(null);
  const careersRef = React.useRef(null);
  const closeTimer = React.useRef(null);

  // Close on route change
  React.useEffect(() => {
    setCareersOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Focus search input when opened
  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close on Escape
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCareersOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isCareersActive = pathname?.startsWith("/careers");

  return (
    <>
      <header className={styles.header}>
        {/* ── LOGO ── */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/images/shared/omoikane-logo.png"
            alt="Omoikane Innovations"
            width={56}
            height={56}
            className={styles.logoImage}
            priority
          />
          <div className={styles.logoBrand}>
            <span className={styles.logoName}>OMOIKANE</span>
            <span className={styles.logoSub}>INNOVATIONS</span>
          </div>
        </Link>

        {/* ── PILL NAV ── */}
        <nav className={styles.pillNav}>
          <ul className={styles.pillList}>
            {NAV_LINKS.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

              if (item.dropdown) {
                return (
                  <li
                    key={item.label}
                    className={styles.pillItem}
                    ref={careersRef}
                    onMouseEnter={() => {
                      if (closeTimer.current) clearTimeout(closeTimer.current);
                      setCareersOpen(true);
                    }}
                    onMouseLeave={() => {
                      closeTimer.current = setTimeout(() => setCareersOpen(false), 120);
                    }}
                  >
                    <button
                      className={`${styles.pillBtn} ${isActive ? styles.pillActive : ""}`}
                      onClick={() => setCareersOpen((v) => !v)}
                      aria-expanded={careersOpen}
                    >
                      {item.label}
                      <motion.svg
                        animate={{ rotate: careersOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        width="10" height="6" viewBox="0 0 10 6" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {careersOpen && (
                        <motion.div
                          className={styles.dropdown}
                          initial={{ opacity: 0, x: "-50%", y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: "-50%", y: 8, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          onMouseEnter={() => {
                            if (closeTimer.current) clearTimeout(closeTimer.current);
                            setCareersOpen(true);
                          }}
                          onMouseLeave={() => {
                            closeTimer.current = setTimeout(() => setCareersOpen(false), 120);
                          }}
                        >
                          <div className={styles.dropdownLabel}>Open Roles</div>
                          {item.dropdown.map((opt) => (
                            <Link key={opt.href} href={opt.href} className={`${styles.dropdownItem} ${pathname === opt.href ? styles.dropdownItemActive : ""}`}>
                              <div className={styles.dropdownItemContent}>
                                <span className={styles.dropdownItemTitle}>{opt.title}</span>
                                <span className={styles.dropdownItemDesc}>{opt.desc}</span>
                              </div>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.dropdownArrow}>
                                <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={item.label} className={styles.pillItem}>
                  <Link
                    href={item.href}
                    className={`${styles.pillBtn} ${isActive ? styles.pillActive : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── RIGHT ACTIONS ── */}
        <div className={styles.rightActions}>
          {/* Search — plain ghost (like Login) */}
          <button
            className={styles.searchTrigger}
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </button>

          {/* Contact — filled pill CTA (like Sign Up) */}
          <Link href="/contact" className={styles.contactBtn}>
            Contact
          </Link>
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.barTop : ""}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barMid : ""}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barBot : ""}`} />
        </button>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV_LINKS.map((item) => (
              <React.Fragment key={item.label}>
                <Link href={item.href} className={`${styles.mobileLink} ${pathname?.startsWith(item.href) && item.href !== "/" ? styles.mobileLinkActive : pathname === "/" && item.href === "/" ? styles.mobileLinkActive : ""}`}>
                  {item.label}
                </Link>
                {item.dropdown && item.dropdown.map((opt) => (
                  <Link key={opt.href} href={opt.href} className={`${styles.mobileSubLink} ${pathname === opt.href ? styles.mobileLinkActive : ""}`}>
                    — {opt.title}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SEARCH OVERLAY ── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              className={styles.searchBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              className={styles.searchModal}
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.searchInputRow}>
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon}>
                  <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search pages, roles, technologies…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchResults.length > 0) {
                      router.push(searchResults[0].href);
                      setSearchOpen(false);
                    }
                  }}
                />
                <kbd className={styles.searchEsc} onClick={() => setSearchOpen(false)}>ESC</kbd>
              </div>

              <div className={styles.searchResults}>
                {searchQuery.trim() === "" && (
                  <div className={styles.searchHint}>
                    {SEARCH_INDEX.slice(0, 6).map((item) => (
                      <Link key={item.href} href={item.href} className={styles.searchResultItem} onClick={() => setSearchOpen(false)}>
                        <span className={styles.searchResultTitle}>{item.title}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.searchResultArrow}>
                          <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}

                {searchQuery.trim() !== "" && searchResults.length === 0 && (
                  <div className={styles.searchEmpty}>No results for "<strong>{searchQuery}</strong>"</div>
                )}

                {searchResults.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.searchResultItem} onClick={() => setSearchOpen(false)}>
                    <div>
                      <div className={styles.searchResultTitle}>{item.title}</div>
                      <div className={styles.searchResultDesc}>{item.desc}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.searchResultArrow}>
                      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
