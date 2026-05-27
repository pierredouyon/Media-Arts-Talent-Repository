import { Link } from "wouter";
import { ArrowUpRight, Briefcase, Megaphone, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA panel */}
        <div className="matr-dark-panel matr-grid matr-ring mb-12 overflow-hidden">
          <div className="absolute inset-y-0 right-0 hidden w-72 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.18),transparent_70%)] lg:block pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-md">
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-white/40">Creative Network</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                Make every next step obvious.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Explore talent, post a role, promote a project, or upgrade a membership without hitting a dead end.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:shrink-0">
              <Link href="/explore">
                <span className="flex h-12 w-full sm:w-auto items-center justify-between gap-3 rounded-2xl bg-[#E50914] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(229,9,20,0.24)] transition-colors hover:bg-[#b40710] cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Users size={15} />
                    Browse Talent
                  </span>
                  <ArrowUpRight size={13} />
                </span>
              </Link>
              <Link href="/jobs">
                <span className="flex h-12 w-full sm:w-auto items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/8 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Briefcase size={15} />
                    Browse Jobs
                  </span>
                  <ArrowUpRight size={13} />
                </span>
              </Link>
              <Link href="/advertise">
                <span className="flex h-12 w-full sm:w-auto items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/8 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Megaphone size={15} />
                    Advertise
                  </span>
                  <ArrowUpRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer columns */}
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand column — full width on mobile */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-[0.8rem] bg-[#E50914] shadow-[0_8px_18px_rgba(229,9,20,0.22)]">
                <span className="text-white font-black text-xs">M</span>
              </div>
              <span className="font-black text-white text-base tracking-tight">MATR</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Media Arts Talent Repository — a creative directory for talent, production teams, and local hiring.
            </p>
          </div>

          {[
            {
              heading: "Discover",
              links: [
                { href: "/explore", label: "Explore Talent" },
                { href: "/jobs", label: "Job Board" },
                { href: "/membership", label: "Membership Plans" },
              ],
            },
            {
              heading: "For Business",
              links: [
                { href: "/post-job", label: "Post a Job" },
                { href: "/advertise", label: "Advertise" },
                { href: "/membership", label: "Business Plans" },
              ],
            },
            {
              heading: "Account",
              links: [
                { href: "/sign-up", label: "Join the Directory" },
                { href: "/sign-in", label: "Sign In" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/admin", label: "Admin Portal" },
              ],
            },
            {
              heading: "Trust",
              links: [
                { href: "/support", label: "Support" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Media Arts Talent Repository. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Windsor, Ontario, Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
