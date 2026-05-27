import { Link } from "wouter";
import { ArrowUpRight, Briefcase, Megaphone, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* CTA panel — liquid glass dark */}
        <div
          className="matr-dark-panel matr-grid matr-ring mb-12 overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 hidden w-80 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.16),transparent_70%)] lg:block pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-5 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-md">
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.28em] text-white/36">Creative Network</p>
              <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">
                Make every next step obvious.
              </h3>
              <p className="text-[13px] text-white/45 leading-relaxed">
                Explore talent, post a role, promote a project, or upgrade a membership without hitting a dead end.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 lg:shrink-0">
              <Link href="/explore">
                <span className="flex h-10 w-full sm:w-auto items-center justify-between gap-3 rounded-full bg-[#E50914] px-5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(229,9,20,0.30)] transition-all hover:bg-[#c8060f] hover:shadow-[0_6px_24px_rgba(229,9,20,0.42)] cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Users size={14} />
                    Browse Talent
                  </span>
                  <ArrowUpRight size={12} />
                </span>
              </Link>
              <Link href="/jobs">
                <span className="flex h-10 w-full sm:w-auto items-center justify-between gap-3 rounded-full border border-white/12 bg-white/[0.05] px-5 text-[13px] font-semibold text-white/85 transition-all hover:bg-white/10 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Briefcase size={14} />
                    Browse Jobs
                  </span>
                  <ArrowUpRight size={12} />
                </span>
              </Link>
              <Link href="/advertise">
                <span className="flex h-10 w-full sm:w-auto items-center justify-between gap-3 rounded-full border border-white/12 bg-white/[0.05] px-5 text-[13px] font-semibold text-white/85 transition-all hover:bg-white/10 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Megaphone size={14} />
                    Advertise
                  </span>
                  <ArrowUpRight size={12} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer columns */}
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-[0.7rem] bg-[#E50914] shadow-[0_4px_14px_rgba(229,9,20,0.30)]">
                <span className="text-white font-black text-[11px]">M</span>
              </div>
              <span className="font-black text-white text-[15px] tracking-tight">MATR</span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-xs">
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
              <h4 className="font-bold text-[10px] uppercase tracking-[0.22em] text-white/30 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-white/50 hover:text-white text-[13px] transition-colors cursor-pointer">
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
        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/28 text-[12px] text-center sm:text-left">
            &copy; {new Date().getFullYear()} Media Arts Talent Repository. All rights reserved.
          </p>
          <p className="text-white/20 text-[11px]">
            Windsor, Ontario, Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
