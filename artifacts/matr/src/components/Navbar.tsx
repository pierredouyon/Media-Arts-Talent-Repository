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
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur-xl">
      {/* Top announcement bar — hidden on xs, visible sm+ */}
      <div className="hidden sm:block border-b border-black/5 bg-black text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles size={12} className="text-[#E50914] shrink-0" />
            <span className="truncate">Creative directory, jobs, ads, and member profiles in one place.</span>
          </div>
          <div className="hidden lg:flex items-center gap-5 text-white/55 shrink-0">
            <span>Windsor-Essex creative network</span>
            <span>Built for talent, crews, and brands</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-3 cursor-pointer group shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-[#E50914] shadow-[0_8px_20px_rgba(229,9,20,0.28)] transition-transform group-hover:-translate-y-0.5">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="block font-black text-black text-base tracking-tight leading-none">MATR</span>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-gray-400 mt-0.5">
                  Media Arts Talent Repository
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav pill — centered */}
          <nav className="hidden lg:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-0.5 rounded-full border border-black/6 bg-[#f7f6f2] px-1.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <span
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      location === link.href
                        ? "bg-white text-[#E50914] shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-black"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              {accountLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                  <span
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      location === link.href
                        ? "bg-white text-[#E50914] shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-black"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Desktop auth actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isLoading ? null : isAuthenticated ? (
              <>
                <span className="hidden rounded-full border border-gray-200 bg-[#f7f6f2] px-3 py-1.5 text-sm text-gray-500 xl:block truncate max-w-[160px]">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button variant="ghost" size="sm" onClick={() => { void signOut(); }} className="rounded-xl" data-testid="button-sign-out">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href={buildAuthHref("/sign-in", { redirectTo: location })}>
                  <Button variant="ghost" size="sm" className="rounded-xl text-gray-600" data-testid="button-sign-in">
                    Sign In
                  </Button>
                </Link>
                <Link href={buildAuthHref("/sign-up", { redirectTo: location })}>
                  <Button
                    size="sm"
                    className="rounded-xl bg-[#E50914] text-white font-semibold shadow-[0_8px_18px_rgba(229,9,20,0.22)] hover:bg-[#b40710] whitespace-nowrap"
                    data-testid="button-sign-up"
                  >
                    Join the Directory
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="rounded-xl border-gray-200 gap-1.5 whitespace-nowrap">
                    Browse Jobs
                    <ArrowUpRight size={13} />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-gray-100 lg:hidden shrink-0"
            onClick={() => setOpen(!open)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
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
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-colors ${
                      location === link.href
                        ? "text-[#E50914] bg-red-50"
                        : "text-gray-700 hover:text-black hover:bg-gray-50"
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
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-colors ${
                      location === link.href
                        ? "text-[#E50914] bg-red-50"
                        : "text-gray-700 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
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
                      <Button variant="outline" className="w-full rounded-xl" size="sm" data-testid="button-mobile-sign-in">
                        Sign In
                      </Button>
                    </Link>
                    <Link href={buildAuthHref("/sign-up", { redirectTo: location })} onClick={() => setOpen(false)}>
                      <Button
                        className="w-full rounded-xl bg-[#E50914] hover:bg-[#b40710] text-white font-semibold"
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
