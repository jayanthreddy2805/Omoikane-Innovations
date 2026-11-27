"use client";
import * as React from "react";
import Link from "@/components/shared/IntentLink";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

// ─── Search index — all searchable pages ──────────────────────────
const SEARCH_INDEX = [
  { title: "Home", desc: "Omoikane Innovations — Aerospace, Defense & Embedded Systems", href: "/" },
  { title: "Technology", desc: "Our advanced technology stack and engineering capabilities", href: "/expertise" },
  { title: "Products", desc: "Mission-critical flight controllers, ESCs, GNSS, and tactical communications", href: "/work" },
  { title: "About Us", desc: "Learn about Omoikane Innovations, our mission and history", href: "/about" },
  { title: "Leadership", desc: "Leadership philosophy, engineering teams, and operational approach", href: "/leadership" },
  { title: "Contact", desc: "Get in touch with the Omoikane team", href: "/contact" },
  { title: "Software Development", desc: "Full-stack web, distributed systems, AI & cloud platforms", href: "/services/software" },
  { title: "Electrical Engineering", desc: "Hardware, PCB design, RF & embedded systems", href: "/services/electronics" },
  { title: "Mechanical Engineering", desc: "CAD design, structural analysis, simulation & thermal engineering", href: "/services/mechanical" },
  { title: "OFC-X Flight Controller", desc: "STM32 / AT32 MCU flight control platform for autonomous UAVs", href: "/work#ofc-x" },
  { title: "OESC-60 / OESC-100 Motor Controller", desc: "60A / 100A 4-in-1 electronic speed controller platform for multirotor propulsion", href: "/work#oesc" },
  { title: "OGN-X GNSS / GPS Module", desc: "Multi-constellation GNSS / GPS navigation module with RTK-ready architecture", href: "/work#ogn-x" },
  { title: "OCOM-X Communication System", desc: "RF / LTE secure link communication architecture for connected systems", href: "/work#ocom-x" },
  { title: "Aerospace Technology", desc: "UAV platforms, flight control, avionics and RF communication", href: "/expertise#aerospace" },
  { title: "Defense Systems", desc: "Secure communications, autonomous surveillance, rugged electronics", href: "/expertise#defense" },
  { title: "Software Development Careers", desc: "React, Next.js, Python, AI Developer, Embedded Firmware roles", href: "/careers/software" },
  { title: "Mechanical Engineering Careers", desc: "CAD, structural analysis, assembly engineering roles", href: "/careers/mechanical" },
  { title: "Electrical Engineering Careers", desc: "Hardware, RF & embedded systems engineering roles", href: "/careers/electronics" },
  { title: "Apply", desc: "Submit your application and resume to Omoikane Innovations", href: "/apply" },
  { title: "FAQ", desc: "Frequently asked questions about engineering, products and standards", href: "/about#faq" },
  { title: "Privacy Notice", desc: "How Omoikane Innovations handles website information", href: "/privacy" },
  { title: "Website Terms", desc: "Terms for using the Omoikane Innovations public website", href: "/terms" },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Technology", href: "/expertise" },
  { label: "Products", href: "/work" },
  { label: "About Us", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  {
    label: "Careers",
    href: "/careers",
    activePath: "/careers",
    dropdown: [
      { title: "Software Development", desc: "Software, AI & real-time systems", href: "/careers/software" },
      { title: "Mechanical Engineering", desc: "Product, structures & integration", href: "/careers/mechanical" },
      { title: "Electrical Engineering", desc: "Hardware, RF & embedded systems", href: "/careers/electronics" },
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
  const [mobileCareersOpen, setMobileCareersOpen] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);

  const [isScrolled, setIsScrolled] = React.useState(false);
  React.useEffect(() => {
    const top = document.getElementById('header-top-threshold');
    const bottom = document.getElementById('header-bottom-threshold');
    const topObserver = new IntersectionObserver(([entry]) => setIsScrolled(entry.boundingClientRect.top < 0));
    const bottomObserver = new IntersectionObserver(([entry]) => setIsHidden(entry.isIntersecting), { rootMargin: '0px 0px 200px 0px' });
    if (top) topObserver.observe(top);
    if (bottom) bottomObserver.observe(bottom);
    return () => { topObserver.disconnect(); bottomObserver.disconnect(); };
  }, []);

  const searchInputRef = React.useRef(null);
  const searchButtonRef = React.useRef(null);
  const searchOpenerRef = React.useRef(null);
  const searchDialogRef = React.useRef(null);
  const mobileButtonRef = React.useRef(null);
  const careersRef = React.useRef(null);
  const closeTimer = React.useRef(null);

  // Close on route change
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCareersOpen(false);
      setSearchOpen(false);
      setMobileOpen(false);
      setMobileCareersOpen(false);
      setSearchQuery("");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  // Search is a modal: focus its input, then return to its opener on close.
  React.useEffect(() => {
    if (!searchOpen) return;
    const opener = searchOpenerRef.current || searchButtonRef.current;
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      opener?.focus();
    };
  }, [searchOpen]);

  const containSearchFocus = (event) => {
    if (event.key !== "Tab" || !searchDialogRef.current) return;
    const controls = Array.from(searchDialogRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])'))
      .filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  // Close on Escape
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (mobileOpen) mobileButtonRef.current?.focus();
        setSearchOpen(false);
        setCareersOpen(false);
        setMobileOpen(false);
        setMobileCareersOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

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

  const handleLogoClick = (e) => {
    // Allow new tab or special modifier clicks (Cmd, Ctrl, Shift, Alt, middle-click)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    setMobileOpen(false);
    setCareersOpen(false);

    if (pathname === "/") {
      e.preventDefault();
      const hero = document.getElementById("hero");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isDarkHero = pathname === "/";
  const isWhiteNav = pathname === "/expertise";

  return (
    <>
      <motion.header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : (isDarkHero ? styles.headerOnDark : (isWhiteNav ? styles.headerWhite : ""))} ${mobileOpen ? styles.headerMobileOpen : ""}`}
        animate={{ y: !mobileOpen && !searchOpen && isHidden ? "-100%" : (isScrolled ? 16 : 0), opacity: !mobileOpen && !searchOpen && isHidden ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* ── LOGO ── */}
        <Link href="/" scroll={true} className={styles.logoLink} onClick={handleLogoClick} aria-label="Omoikane Innovations">
          <Image
            src="/images/shared/omoikane-logo.png"
            alt=""
            width={56}
            height={56}
            className={styles.logoImage}

          />
          <div className={styles.logoBrand}>
            <span className={styles.logoName}>OMOIKANE </span>
            <span className={styles.logoSub}>INNOVATIONS</span>
          </div>
        </Link>

        {/* ── PILL NAV ── */}
        <nav className={styles.pillNav}>
          <ul className={styles.pillList}>
            {NAV_LINKS.map((item) => {
              const activePath = item.activePath || item.href;
              const isActive = activePath === "/"
                ? pathname === "/"
                : pathname?.startsWith(activePath);

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
                      type="button"
                      className={`${styles.pillBtn} ${isActive ? styles.pillActive : ""}`}
                      onClick={() => setCareersOpen(true)}
                      aria-expanded={careersOpen}
                      aria-controls={careersOpen ? "careers-dropdown" : undefined}
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
                          id="careers-dropdown"
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
            ref={searchButtonRef}
            className={styles.searchTrigger}
            onClick={() => {
              searchOpenerRef.current = searchButtonRef.current;
              setSearchOpen(true);
            }}
            aria-label="Search"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            aria-controls={searchOpen ? "site-search-dialog" : undefined}
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
          ref={mobileButtonRef}
          className={styles.hamburger}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          aria-controls={mobileOpen ? "mobile-navigation" : undefined}
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.barTop : ""}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barMid : ""}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barBot : ""}`} />
        </button>
        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {NAV_LINKS.map((item) => (
                <React.Fragment key={item.label}>
                  {item.dropdown ? (
                    <div
                      className={styles.mobileLinkRow}
                      onClick={() => setMobileCareersOpen((open) => !open)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setMobileCareersOpen((open) => !open);
                        }
                      }}
                      aria-expanded={mobileCareersOpen}
                      aria-controls="mobile-career-categories"
                      style={{ cursor: "pointer" }}
                    >
                      <span className={`${styles.mobileLink} ${pathname?.startsWith(item.activePath || item.href) ? styles.mobileLinkActive : ""}`}>
                        {item.label}
                      </span>
                      <span
                        className={styles.mobileDisclosure}
                        aria-hidden="true"
                      >
                        {mobileCareersOpen ? "−" : "+"}
                      </span>
                    </div>
                  ) : (
                    <div className={styles.mobileLinkRow}>
                      <Link href={item.href} onClick={() => setMobileOpen(false)} className={`${styles.mobileLink} ${pathname?.startsWith(item.activePath || item.href) && item.href !== "/" ? styles.mobileLinkActive : pathname === "/" && item.href === "/" ? styles.mobileLinkActive : ""}`}>
                        {item.label}
                      </Link>
                    </div>
                  )}
                  {item.dropdown && mobileCareersOpen && (
                    <div id="mobile-career-categories" className={styles.mobileSubMenu}>
                      {item.dropdown.map((opt) => (
                        <Link key={opt.href} href={opt.href} onClick={() => setMobileOpen(false)} className={`${styles.mobileSubLink} ${pathname === opt.href ? styles.mobileLinkActive : ""}`}>
                          {opt.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
              <button
                type="button"
                className={styles.mobileSearchButton}
                onClick={() => {
                  searchOpenerRef.current = mobileButtonRef.current;
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
              >
                Search this website
              </button>
              <Link href="/contact" className={styles.mobileContactLink} onClick={() => setMobileOpen(false)}>
                Contact us
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

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
              style={{ x: "-50%" }}
              id="site-search-dialog"
              ref={searchDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="site-search-label"
              onKeyDown={containSearchFocus}
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <label id="site-search-label" htmlFor="site-search" className={styles.searchLabel}>Search this website</label>
              <div className={styles.searchInputRow}>
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon}>
                  <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchInputRef}
                  id="site-search"
                  type="text"
                  placeholder="Search pages, roles, technologies…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchResults.length > 0) {
                      if (typeof window !== "undefined") {
                        router.push(searchResults[0].href);
                      }
                      setSearchOpen(false);
                    }
                  }}
                />
                <button type="button" className={styles.searchClose} aria-label="Close search" onClick={() => setSearchOpen(false)}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M6 18 18 6" /></svg>
                </button>
              </div>

              <div className={styles.searchResults}>
                {searchQuery.trim() === "" && (
                  <div className={styles.searchHint}>
                    {SEARCH_INDEX.slice(0, 6).map((item) => (
                      <Link key={`${item.title}-${item.href}`} href={item.href} className={styles.searchResultItem} onClick={() => setSearchOpen(false)}>
                        <span className={styles.searchResultTitle}>{item.title}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.searchResultArrow}>
                          <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}

                {searchQuery.trim() !== "" && searchResults.length === 0 && (
                  <div className={styles.searchEmpty}>No results for “<strong>{searchQuery}</strong>”</div>
                )}

                {searchResults.map((item) => (
                  <Link key={`${item.title}-${item.href}`} href={item.href} className={styles.searchResultItem} onClick={() => setSearchOpen(false)}>
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
