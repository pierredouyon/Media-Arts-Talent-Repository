import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { buildAuthHref } from "@/lib/auth-routes";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Talent" },
  { href: "/membership", label: "Membership Plans" },
  { href: "/post-job", label: "Post a Job" },
  { href: "/advertise", label: "Advertise" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, signOut, isLoading } = useAuth();

  const accountLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="hidden sm:block bg-[#0a0a0a] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/60">
            <Sparkles size={11} className="text-[#E50914] shrink-0" />
            <span className="truncate">Creative directory, jobs, ads, and member profiles in one place.</span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-white/40 shrink-0 text-[11px]">
            <span>Windsor-Essex creative network</span>
            <span>Built for talent, crews, and brands</span>
          </div>
        </div>
      </div>

      {/* Main nav — liquid glass */}
      <div
        className="border-b border-black/[0.06]"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(48px) saturate(180%)",
          WebkitBackdropFilter: "blur(48px) saturate(180%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.80) inset, 0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-[58px] items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" data-testid="link-logo">
              <div className="flex items-center gap-2.5 cursor-pointer group shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-[0.8rem] bg-[#E50914] shadow-[0_6px_16px_rgba(229,9,20,0.32)] transition-all group-hover:shadow-[0_8px_24px_rgba(229,9,20,0.42)] group-hover:-translate-y-px">
                  <span className="text-white font-black text-sm">M</span>
                </div>
                <div className="hidden sm:block">
                  <span className="block font-black text-[#0a0a0a] text-[15px] tracking-tight leading-none">MATR</span>
                  <span className="block text-[9px] uppercase tracking-[0.22em] text-gray-400 mt-0.5">
                    Media Arts Talent Repository
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop nav pill */}
            <nav className="hidden lg:flex flex-1 items-center justify-center">
              <div
                className="flex items-center gap-0.5 rounded-full px-1.5 py-1"
                style={{
                  background: "rgba(240,238,234,0.80)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(17,17,17,0.08)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.90) inset",
                }}
              >
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <span
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all whitespace-nowrap ${
                        location === link.href
                          ? "bg-white text-[#E50914] shadow-[0_1px_4px_rgba(0,0,0,0.10)] font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
                {accountLinks.map((link) => (
                  <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                    <span
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all whitespace-nowrap ${
                        location === link.href
                          ? "bg-white text-[#E50914] shadow-[0_1px_4px_rgba(0,0,0,0.10)] font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {isLoading ? null : isAuthenticated ? (
                <>
                  <span className="hidden rounded-full border border-black/8 bg-black/[0.04] px-3 py-1.5 text-[13px] text-gray-600 xl:block truncate max-w-[160px]">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { void signOut(); }}
                    className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-black/5 text-[13px] h-8 px-4"
                    data-testid="button-sign-out"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href={buildAuthHref("/sign-in", { redirectTo: location })}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-black/5 text-[13px] h-8 px-4"
                      data-testid="button-sign-in"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href={buildAuthHref("/sign-up", { redirectTo: location })}>
                    <Button
                      size="sm"
                      className="rounded-full bg-[#E50914] text-white font-semibold shadow-[0_4px_14px_rgba(229,9,20,0.30)] hover:bg-[#c8060f] hover:shadow-[0_6px_20px_rgba(229,9,20,0.40)] transition-all text-[13px] h-8 px-4 whitespace-nowrap"
                      data-testid="button-sign-up"
                    >
                      Join the Directory
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-black/12 text-gray-700 hover:bg-black/5 gap-1.5 text-[13px] h-8 px-4 whitespace-nowrap"
                    >
                      Browse Jobs
                      <ArrowUpRight size={12} />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="flex items-center justify-center rounded-full w-9 h-9 text-gray-700 hover:bg-black/6 lg:hidden shrink-0 transition-colors"
              onClick={() => setOpen(!open)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(48px) saturate(180%)",
              WebkitBackdropFilter: "blur(48px) saturate(180%)",
              borderBottom: "1px solid rgba(17,17,17,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span
                    className={`flex items-center px-3.5 py-2.5 text-[14px] font-medium rounded-xl cursor-pointer transition-colors ${
                      location === link.href
                        ? "text-[#E50914] bg-[#E50914]/6 font-semibold"
                        : "text-gray-700 hover:text-gray-900 hover:bg-black/4"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  <span
                    className={`flex items-center px-3.5 py-2.5 text-[14px] font-medium rounded-xl cursor-pointer transition-colors ${
                      location === link.href
                        ? "text-[#E50914] bg-[#E50914]/6 font-semibold"
                        : "text-gray-700 hover:text-gray-900 hover:bg-black/4"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-3 mt-1 border-t border-black/6 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-black/10 text-gray-700 font-medium"
                    size="sm"
                    onClick={() => {
                      void signOut();
                      setOpen(false);
                    }}
                    data-testid="button-mobile-sign-out"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href={buildAuthHref("/sign-in", { redirectTo: location })} onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-black/10 text-gray-700 font-medium"
                        size="sm"
                        data-testid="button-mobile-sign-in"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href={buildAuthHref("/sign-up", { redirectTo: location })} onClick={() => setOpen(false)}>
                      <Button
                        className="w-full rounded-xl bg-[#E50914] hover:bg-[#c8060f] text-white font-semibold shadow-[0_4px_14px_rgba(229,9,20,0.28)]"
                        size="sm"
                        data-testid="button-mobile-sign-up"
                      >
                        Join the Directory
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
