import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Megaphone,
  Monitor,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TalentCard from "@/components/TalentCard";
import PlanCard from "@/components/PlanCard";
import { useGetFeaturedTalents, useGetMembershipPlans } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { buildAuthHref } from "@/lib/auth-routes";

const TALENT_TYPES = [
  "Photographer", "Filmmaker", "Videographer", "Musician", "Voice Actor",
  "Graphic Designer", "Actor", "Model", "Producer", "Sound Engineer",
  "Animator", "Writer", "DJ", "Makeup Artist", "Art Director",
];

const HERO_IMAGE = `${import.meta.env.BASE_URL}opengraph.jpg`;

const WORKFLOWS = [
  {
    icon: Users,
    title: "Find talent fast",
    text: "Search the directory by specialty, city, and experience so you can build a cast, crew, or campaign team without guessing.",
    href: "/explore",
    cta: "Explore talent",
  },
  {
    icon: Briefcase,
    title: "Post clear opportunities",
    text: "Create public job listings that give creators the exact details they need to respond quickly and professionally.",
    href: "/post-job",
    cta: "Post a job",
  },
  {
    icon: Megaphone,
    title: "Promote your brand",
    text: "Run simple placements that keep your project visible to a focused local creative audience.",
    href: "/advertise",
    cta: "Advertise",
  },
];

export default function HomePage() {
  const [planToggle, setPlanToggle] = useState<"individual" | "business">("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();

  const { data: featuredTalents, isLoading: loadingTalents } = useGetFeaturedTalents();
  const { data: plans, isLoading: loadingPlans } = useGetMembershipPlans();

  const individualPlans = plans?.filter((p) => !p.isBusinessPlan) ?? [];
  const businessPlans = plans?.filter((p) => p.isBusinessPlan) ?? [];
  const displayPlans = planToggle === "individual" ? individualPlans : businessPlans;

  return (
    <div className="bg-[#f2f0ec]">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-[#080808]">
        {/* Background layers */}
        <div className="absolute inset-0 matr-grid opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_14%_0%,rgba(229,9,20,0.28),transparent_40%),radial-gradient(ellipse_at_80%_100%,rgba(229,9,20,0.12),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.0),rgba(0,0,0,0.60))]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">

            {/* Left col */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="matr-dark-kicker mb-6">
                <Sparkles size={12} className="text-[#E50914]" />
                Creative discovery, hiring, and promotion in one product
              </div>

              <h1 className="text-[2.8rem] md:text-[3.8rem] lg:text-[4.4rem] font-black text-white leading-[0.93] tracking-tight mb-5">
                Connect with content creators through the{" "}
                <span className="text-white/90">Media Arts</span>
                <span className="text-[#E50914]"> Talent Repository.</span>
              </h1>

              <p className="mb-8 max-w-xl text-[1rem] leading-relaxed text-white/62 md:text-lg">
                Gain exposure for your creative talents, or find the right people to join your cast, crew, or team.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/explore">
                  <Button
                    size="lg"
                    className="bg-[#E50914] hover:bg-[#c8060f] text-white font-bold text-[15px] px-8 h-11 rounded-full group shadow-[0_6px_24px_rgba(229,9,20,0.36)] transition-all hover:shadow-[0_8px_32px_rgba(229,9,20,0.48)]"
                    data-testid="button-explore-talent"
                  >
                    Explore Talent
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href={isAuthenticated ? "/dashboard" : buildAuthHref("/sign-up", { redirectTo: "/membership" })}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/18 text-white bg-white/8 hover:bg-white/14 font-semibold text-[15px] px-8 h-11 rounded-full backdrop-blur-sm transition-all"
                    data-testid="button-join-directory"
                  >
                    {isAuthenticated ? "Open Dashboard" : "Join the Directory"}
                  </Button>
                </Link>
              </div>

              {/* Search bar */}
              <div className="matr-dark-panel p-4">
                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search photographers, actors, editors…"
                      className="pl-10 h-10 rounded-full border-white/10 bg-black/30 text-white placeholder:text-white/28 text-sm focus-visible:ring-[#E50914]/40"
                      data-testid="input-search-talent"
                    />
                  </div>
                  <Link href={`/explore${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`}>
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 font-semibold h-10 px-5 rounded-full text-sm transition-all"
                      data-testid="button-search-submit"
                    >
                      Search
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {TALENT_TYPES.slice(0, 6).map((type) => (
                    <Link key={type} href={`/explore?talentType=${encodeURIComponent(type)}`}>
                      <span className="inline-flex cursor-pointer rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1 text-[11px] text-white/58 transition-colors hover:text-white/80">
                        {type}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right col — hero visual */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.80, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[440px] overflow-hidden rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
                style={{
                  background: "linear-gradient(135deg, #1a0a0a 0%, #0f0f12 50%, #0a0f1a 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                <img
                  src={HERO_IMAGE}
                  alt="Creative professionals collaborating"
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-[#E50914]/10" />

                {/* Top cards */}
                <div className="absolute left-4 top-4 right-4 flex justify-between gap-3">
                  <div
                    className="rounded-2xl px-4 py-3 text-white"
                    style={{
                      background: "rgba(10,10,14,0.58)",
                      backdropFilter: "blur(32px) saturate(180%)",
                      WebkitBackdropFilter: "blur(32px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/36 mb-1">Directory</p>
                    <p className="text-[13px] font-semibold text-white/90 max-w-[160px]">Search talent, compare specialties, move faster.</p>
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 text-right text-white"
                    style={{
                      background: "rgba(229,9,20,0.14)",
                      backdropFilter: "blur(32px) saturate(180%)",
                      WebkitBackdropFilter: "blur(32px) saturate(180%)",
                      border: "1px solid rgba(229,9,20,0.24)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/36 mb-1">MATR</p>
                    <p className="text-[13px] font-semibold text-white/90 max-w-[150px]">Built for creative work that needs real momentum.</p>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {[
                    { value: "15+", label: "Talent Types" },
                    { value: "Jobs", label: "Board" },
                    { value: "Ads", label: "Reach" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex-1 rounded-xl px-3 py-2.5 text-center"
                      style={{
                        background: "rgba(10,10,14,0.62)",
                        backdropFilter: "blur(32px) saturate(180%)",
                        WebkitBackdropFilter: "blur(32px) saturate(180%)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
                      }}
                    >
                      <p className="text-[16px] font-black text-white leading-tight">{stat.value}</p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/36">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom feature cards */}
                <div className="absolute bottom-16 left-4 right-4 grid gap-2 grid-cols-3">
                  {[
                    "Public profiles that feel review-ready",
                    "Job posting flow with clear conversion paths",
                    "Advertising placements tied back to the dashboard",
                  ].map((point) => (
                    <div
                      key={point}
                      className="rounded-xl p-3 text-[11px] text-white/78"
                      style={{
                        background: "rgba(10,10,14,0.55)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <CheckCircle2 size={13} className="text-[#E50914] mb-1.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="text-white/30" size={24} />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="bg-[#f2f0ec] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <div className="matr-section-kicker mb-3">
                <Sparkles size={11} className="text-[#E50914]" />
                How The Product Works
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] mb-3 leading-tight">
                Built to move people from discovery to action.
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                MATR is strongest when every page leads naturally into the next step. These are the three paths that matter most.
              </p>
            </div>
            <Link href={isAuthenticated ? "/dashboard" : buildAuthHref("/sign-in", { redirectTo: "/dashboard" })}>
              <Button
                variant="outline"
                className="rounded-full border-black/14 text-gray-700 hover:bg-black hover:text-white shrink-0 text-[13px] h-9 px-5 transition-all"
              >
                {isAuthenticated ? "View Member Dashboard" : "Sign In for Dashboard"}
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {WORKFLOWS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="matr-premium-card p-6"
              >
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a0a0a] text-white shadow-[0_8px_24px_rgba(0,0,0,0.20)]">
                    <item.icon size={17} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="relative z-10 text-xl font-black text-[#0a0a0a] mb-2">{item.title}</h3>
                <p className="relative z-10 text-gray-500 leading-relaxed mb-5 text-[14px]">{item.text}</p>
                <Link href={item.href}>
                  <Button
                    variant="outline"
                    className="relative z-10 rounded-full border-black/12 text-gray-700 hover:bg-[#0a0a0a] hover:text-white gap-2 text-[13px] h-9 px-5 transition-all"
                  >
                    {item.cta}
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP ────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_0.88fr] gap-10 items-center mb-10"
          >
            <div className="max-w-xl">
              <div className="matr-section-kicker mb-3">
                <Sparkles size={11} className="text-[#E50914]" />
                Membership
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] mb-3 leading-tight">
                Join our creative talent directory.
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed max-w-lg">
                Individual plans range from $25/year to $250/year, with business options when you need hiring and promotion tools in the same account.
              </p>

              <div className="mt-7 inline-flex bg-[#f0eeea] rounded-full p-1 border border-black/8">
                <button
                  onClick={() => setPlanToggle("individual")}
                  className={`px-5 py-2 text-[13px] font-semibold rounded-full transition-all ${
                    planToggle === "individual"
                      ? "bg-[#0a0a0a] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  data-testid="button-toggle-individual"
                >
                  Individual
                </button>
                <button
                  onClick={() => setPlanToggle("business")}
                  className={`px-5 py-2 text-[13px] font-semibold rounded-full transition-all ${
                    planToggle === "business"
                      ? "bg-[#0a0a0a] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  data-testid="button-toggle-business"
                >
                  Business
                </button>
              </div>
            </div>

            {/* Membership image panel */}
            <div
              className="relative h-[260px] md:h-[300px] overflow-hidden rounded-[1.8rem]"
              style={{
                background: "linear-gradient(135deg, #0f0f12 0%, #1a0a0a 100%)",
                border: "1px solid rgba(17,17,17,0.08)",
                boxShadow: "0 16px 60px rgba(0,0,0,0.10)",
              }}
            >
              <img
                src={HERO_IMAGE}
                alt="Talent directory preview"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
              <div
                className="absolute right-5 top-5 hidden rounded-2xl px-5 py-4 shadow-xl md:block"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.90)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,1) inset",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1.5">Plans</p>
                <p className="text-2xl font-black text-[#0a0a0a]">$25 to $250</p>
                <p className="mt-1 text-[12px] text-gray-500">Visibility, hiring, and growth.</p>
              </div>
              <div className="absolute left-0 top-0 flex h-full max-w-[60%] flex-col justify-end p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E50914] mb-2">
                  Membership
                </p>
                <p className="text-2xl font-black text-[#0a0a0a] leading-tight">
                  Build a stronger profile and turn visibility into action.
                </p>
              </div>
            </div>
          </motion.div>

          {loadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-[#f2f0ec] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${displayPlans.length <= 2 ? "lg:grid-cols-2 max-w-2xl mx-auto" : "lg:grid-cols-4"}`}>
              {displayPlans.map((plan, i) => (
                <PlanCard key={plan.slug} {...plan} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TALENT DIRECTORY PREVIEW ──────────────────── */}
      <section className="py-14 lg:py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <div className="matr-dark-kicker mb-3">
                <Sparkles size={11} className="text-[#E50914]" />
                Directory Preview
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                Discover Talent
              </h2>
              <p className="text-white/55 text-[15px]">
                Search our database for talent to build your cast, crew, or creative team.
              </p>
            </div>
            <Link href="/explore">
              <Button className="bg-[#E50914] hover:bg-[#c8060f] text-white font-semibold rounded-full shadow-[0_4px_20px_rgba(229,9,20,0.30)] transition-all hover:shadow-[0_6px_28px_rgba(229,9,20,0.42)] text-[13px] h-9 px-5">
                Open Full Directory
              </Button>
            </Link>
          </div>

          {loadingTalents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredTalents && featuredTalents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredTalents.slice(0, 8).map((talent, i) => (
                <TalentCard key={talent.id} {...talent} index={i} />
              ))}
            </div>
          ) : (
            <div className="matr-dark-panel p-8">
              <p className="text-white/80 font-semibold mb-2">The directory is ready to browse.</p>
              <p className="text-white/45 mb-5 text-[14px]">
                Featured members will appear here as more profiles are completed and upgraded.
              </p>
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="border-white/14 bg-transparent text-white hover:bg-white/10 rounded-full text-[13px] h-9 px-5"
                >
                  Browse the Directory
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── JOBS ──────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white bg-[#0a0a0a]">
                <Briefcase size={12} className="text-[#E50914]" />
                Jobs
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-[#0a0a0a]">
                Hire Content Creators / Talent
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-5">
                Use Browse Jobs to review current opportunities. Once you know the role you need to fill, use Post a Job to reach the MATR community directly.
              </p>
              <div className="grid gap-2.5 mb-7">
                {[
                  "Browse active listings before posting to understand the market.",
                  "Sort by talent type or city to compare roles quickly.",
                  "Return to your dashboard after checkout to manage every listing.",
                ].map((item) => (
                  <div key={item} className="matr-premium-card flex items-start gap-3 p-4">
                    <CheckCircle2 size={16} className="text-[#E50914] mt-0.5 shrink-0" />
                    <p className="relative z-10 text-gray-600 text-[14px]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-baseline gap-2 mb-7">
                <span className="text-[2.8rem] font-black text-[#E50914]">$100</span>
                <span className="text-gray-400 text-[14px]">per posting / 2 months</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/post-job">
                  <Button
                    size="lg"
                    className="bg-[#E50914] hover:bg-[#c8060f] text-white font-bold px-8 h-11 rounded-full shadow-[0_4px_20px_rgba(229,9,20,0.28)] transition-all"
                    data-testid="button-post-job"
                  >
                    Post a Job
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-black/14 text-gray-700 hover:bg-[#0a0a0a] hover:text-white font-semibold px-8 h-11 rounded-full transition-all"
                    data-testid="button-browse-jobs"
                  >
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div
                className="relative h-[380px] overflow-hidden rounded-[2rem]"
                style={{
                  background: "linear-gradient(135deg, #0f0f12 0%, #1a0808 100%)",
                  border: "1px solid rgba(17,17,17,0.08)",
                  boxShadow: "0 20px 80px rgba(0,0,0,0.12)",
                }}
              >
                <img
                  src={HERO_IMAGE}
                  alt="Creative hiring board"
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div
                  className="absolute right-5 top-5 rounded-2xl px-5 py-4 text-white"
                  style={{
                    background: "rgba(10,10,14,0.60)",
                    backdropFilter: "blur(32px) saturate(180%)",
                    WebkitBackdropFilter: "blur(32px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/36 mb-1">Workflow</p>
                  <p className="text-[14px] font-bold text-white/90">Browse Jobs before you Post a Job.</p>
                </div>
                <div className="absolute left-0 top-0 flex h-full max-w-[70%] flex-col justify-end p-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E50914] mb-2">
                    Browse first
                  </p>
                  <p className="text-2xl font-black text-white leading-tight">
                    Review current jobs, then post when the role is clear and ready to convert.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ADVERTISING ───────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-[#f2f0ec]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="matr-section-kicker mb-5">
              <Monitor size={12} className="text-gray-500" />
              <span className="text-gray-500 text-[11px] font-bold tracking-normal uppercase">Advertising</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] mb-3 leading-tight">
              Reach Content Creators
            </h2>
            <p className="text-gray-500 text-[15px] max-w-md mx-auto">
              Promote your brand, project, or service to engaged content creators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: "Sidebar Advertisement",
                price: "$30/month",
                description: "Prominent placement visible across the key browsing pages.",
                specs: "300 × 250px recommended",
                badge: "Most Visible",
              },
              {
                name: "Footer Advertisement",
                price: "$15/month",
                description: "Cost-efficient brand exposure across the site footer.",
                specs: "728 × 90px recommended",
                badge: "Best Value",
              },
            ].map((ad, i) => (
              <motion.div
                key={ad.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="matr-premium-card h-full p-6">
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <h3 className="text-[18px] font-black text-[#0a0a0a]">{ad.name}</h3>
                    <span className="text-[11px] bg-[#0a0a0a] text-white px-2.5 py-1 rounded-full font-bold tracking-wide shrink-0 ml-2">
                      {ad.badge}
                    </span>
                  </div>
                  <div className="relative z-10 text-[2rem] font-black text-[#E50914] mb-2 leading-tight">{ad.price}</div>
                  <p className="relative z-10 text-gray-500 text-[14px] mb-3">{ad.description}</p>
                  <p className="relative z-10 text-gray-400 text-[12px] mb-5 font-mono">{ad.specs}</p>
                  <Link href="/advertise">
                    <Button
                      className="relative z-10 w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-semibold rounded-full text-[13px] h-10 transition-all"
                      data-testid={`button-advertise-${i}`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-[#E50914]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-10 items-center"
          >
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
                Join our creative talent directory.
              </h2>
              <p className="text-white/78 text-[15px] mb-8 max-w-lg">
                Plans range from $25/year to $250/yr.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={isAuthenticated ? "/membership" : buildAuthHref("/sign-up", { redirectTo: "/membership" })}>
                  <Button
                    size="lg"
                    className="bg-white text-[#E50914] hover:bg-gray-50 font-bold px-10 h-11 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.14)] transition-all"
                    data-testid="button-cta-join"
                  >
                    {isAuthenticated ? "Choose a Plan" : "Join the Directory"}
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/12 font-semibold px-10 h-11 rounded-full transition-all"
                    data-testid="button-cta-explore"
                  >
                    Explore First
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="relative h-[280px] md:h-[320px] overflow-hidden rounded-[1.8rem]"
              style={{
                background: "rgba(180,7,16,0.50)",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              <img
                src={HERO_IMAGE}
                alt="Creative directory members"
                className="absolute inset-0 h-full w-full object-cover opacity-40"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#E50914] via-[#E50914]/70 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.16),transparent_40%)]" />
              <div
                className="absolute right-5 top-5 rounded-2xl px-5 py-4 text-white"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.20) inset",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Final Step</p>
                <p className="text-[15px] font-black text-white max-w-[160px] leading-snug">Create a profile that looks ready before anyone clicks in.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
