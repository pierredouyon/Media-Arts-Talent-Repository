import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#E50914] rounded-sm flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="font-black text-white text-lg tracking-tight">MATR</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Media Arts Talent Repository — Windsor's premier creative talent directory.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Discover
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/explore", label: "Explore Talent" },
                { href: "/jobs", label: "Job Board" },
                { href: "/membership", label: "Membership Plans" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              For Business
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/post-job", label: "Post a Job" },
                { href: "/advertise", label: "Advertise" },
                { href: "/membership", label: "Business Plans" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Account
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/sign-up", label: "Join the Directory" },
                { href: "/sign-in", label: "Sign In" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
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
