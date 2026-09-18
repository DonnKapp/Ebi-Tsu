import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLockup } from "./BrandMark";

type SiteShellProps = { children: ReactNode };

const navItems = [
  { label: "Home", href: "/" },
  { label: "Neocaridina", href: "/neocaridina" },
  { label: "Caridina", href: "/caridina" },
  { label: "About", href: "/about" },
  { label: "Account", href: "/account" },
];

export function SiteShell({ children }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isLightPage = location !== "/";

  return (
    <div className="site-shell">
      <header className={`site-header ${isLightPage ? "site-header--light" : ""}`}>
        <div className="site-header__inner">
          <Link href="/" className="site-header__brand" onClick={() => setMenuOpen(false)}><BrandLockup compact /></Link>
          <button className="site-header__menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Primary navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href} className={location === item.href ? "site-nav__link site-nav__link--active" : "site-nav__link"} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
            <Link href="/contact" className="site-nav__contact" onClick={() => setMenuOpen(false)}>Start a conversation <ArrowUpRight size={15} /></Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer"><div className="site-footer__inner"><div className="site-footer__brand"><BrandLockup /><p>A considered home for shrimp, aquariums, and the people who notice the difference.</p></div><div className="site-footer__meta"><span>海老通</span><span>© 2026 Ebi Tsū. All rights reserved.</span><span>The Shrimp Connoisseur.</span></div></div></footer>
    </div>
  );
}
