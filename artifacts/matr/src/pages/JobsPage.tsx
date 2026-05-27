import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, CheckCircle2, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListJobs, getListJobsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { buildAuthHref } from "@/lib/auth-routes";

const CATEGORIES = [
  "Photography", "Film & Video", "Music", "Graphic Design", "Voice Acting",
  "Acting & Performance", "Modeling", "Production", "Sound Engineering",
  "Animation", "Writing & Content",
];
const CITIES = ["Windsor", "Tecumseh", "LaSalle", "Amherstburg", "Essex", "Leamington"];

export default function JobsPage() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);

  const params: Record<string, string | number> = { page, limit: 10 };
  if (search) params.search = search;
  if (city) params.city = city;
  if (category) params.category = category;

  const { data, isLoading } = useListJobs(params, {
    query: { queryKey: getListJobsQueryKey(params) },
  });

  const sortedJobs = [...(data?.jobs ?? [])].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "talent-asc") return a.category.localeCompare(b.category);
    if (sortBy === "talent-desc") return b.category.localeCompare(a.category);
    if (sortBy === "city-asc") return a.city.localeCompare(b.city);
    if (sortBy === "city-desc") return b.city.localeCompare(a.city);
    return 0;
  });

  const hasFilters = Boolean(search || city || category);
  const clearFilters = () => { setSearch(""); setCity(""); setCategory(""); setSortBy("recent"); setPage(1); };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">

      {/* ── HERO ── */}
      <div className="bg-[#080808] text-white py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="matr-dark-kicker mb-5 inline-flex">
                <Sparkles size={11} className="text-[#E50914]" />
                Job Board
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black mb-3 leading-tight"
              >
                Browse Jobs
              </motion.h1>
              <p className="text-white/50 text-[15px] max-w-xl">
                Review current opportunities, then narrow the list by talent type or city.
              </p>
            </div>
            <Link href="/post-job">
              <Button
                className="flex-shrink-0 bg-[#E50914] hover:bg-[#c8060f] text-white font-bold px-7 h-11 rounded-full shadow-[0_4px_20px_rgba(229,9,20,0.30)] transition-all"
                data-testid="button-post-job"
              >
                Post a Job
                <ArrowRight size={15} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
        {/* Filter + tips row */}
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] mb-6">

          {/* Filter panel */}
          <div className="matr-premium-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search jobs..."
                  className="pl-10 h-10 rounded-full border-black/8 text-sm bg-[#f7f6f2]"
                  data-testid="input-job-search"
                />
              </div>
              <Select value={category} onValueChange={(value) => { setCategory(value === "all" ? "" : value); setPage(1); }}>
                <SelectTrigger className="h-10 rounded-full border-black/8 text-sm bg-[#f7f6f2]" data-testid="select-job-category">
                  <SelectValue placeholder="Talent Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Talent Type</SelectItem>
                  {CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={city} onValueChange={(value) => { setCity(value === "all" ? "" : value); setPage(1); }}>
                <SelectTrigger className="h-10 rounded-full border-black/8 text-sm bg-[#f7f6f2]" data-testid="select-job-city">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any City</SelectItem>
                  {CITIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 rounded-full border-black/8 text-sm bg-[#f7f6f2]" data-testid="select-job-sort">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="talent-asc">Talent A–Z</SelectItem>
                  <SelectItem value="talent-desc">Talent Z–A</SelectItem>
                  <SelectItem value="city-asc">City A–Z</SelectItem>
                  <SelectItem value="city-desc">City Z–A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-black/5">
              <p className="text-[13px] text-gray-400">
                Sort by talent or city, then contact listings directly from the board.
              </p>
              {hasFilters && (
                <Button variant="outline" className="rounded-full border-black/10 text-gray-600 text-[12px] h-8 px-4" onClick={clearFilters} data-testid="button-clear-job-filters">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Tips panel */}
          <div className="matr-dark-panel p-6 text-white">
            <div className="relative z-10 flex items-center gap-2 mb-4">
              <Sparkles size={13} className="text-[#E50914]" />
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-semibold">How To Use The Board</p>
            </div>
            <div className="relative z-10 space-y-3">
              {[
                "Browse active roles first so you can compare category, city, and compensation.",
                "Use the filters to tighten the list instead of scanning every listing manually.",
                "When you are ready to hire, post a role and return to the dashboard to track it.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#E50914] mt-0.5 shrink-0" />
                  <span className="text-[13px] text-white/62 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-white/60 rounded-2xl animate-pulse" />)}
          </div>
        ) : sortedJobs.length > 0 ? (
          <>
            <div className="matr-premium-card mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
              <p className="relative z-10 text-[13px] text-gray-500" data-testid="text-jobs-count">
                {data?.total} job{data?.total !== 1 ? "s" : ""} available
              </p>
              <div className="relative z-10 flex flex-wrap gap-2">
                {["Direct contact", "City sorting", "Talent sorting"].map((tag) => (
                  <span key={tag} className="rounded-full border border-black/8 bg-black/4 px-3 py-1 text-[11px] text-gray-500">{tag}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {sortedJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="matr-premium-card p-6 transition-all"
                  data-testid={`card-job-${job.id}`}
                >
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#0a0a0a] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                          <Briefcase size={15} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0a0a0a] text-[16px] leading-snug" data-testid={`text-job-title-${job.id}`}>
                            {job.title}
                          </h3>
                          <p className="text-gray-500 text-[13px]">{job.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[13px] leading-relaxed mt-2 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 mt-3">
                        <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                          <MapPin size={11} />
                          <span>{job.city}, {job.province}</span>
                        </div>
                        <span className="text-[11px] bg-[#E50914]/8 text-[#E50914] px-2.5 py-1 rounded-full font-bold border border-[#E50914]/12">
                          {job.category}
                        </span>
                        {job.compensation && (
                          <span className="text-[11px] bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-200">
                            {job.compensation}
                          </span>
                        )}
                      </div>
                    </div>
                    <a href={`mailto:${job.contactEmail}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 rounded-full border-black/10 text-gray-700 hover:bg-[#0a0a0a] hover:text-white text-[12px] h-9 px-4 transition-all"
                        data-testid={`button-apply-${job.id}`}
                      >
                        Apply
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 matr-premium-card flex items-center justify-center mx-auto mb-5">
              <Briefcase size={24} className="text-gray-400 relative z-10" />
            </div>
            <h3 className="text-xl font-black text-[#0a0a0a] mb-2">
              {hasFilters ? "No jobs match these filters" : "No jobs posted yet"}
            </h3>
            <p className="text-gray-500 text-[14px] mb-7 max-w-sm mx-auto">
              {hasFilters
                ? "Reset the filters to review every active opportunity, or post a new role if you are hiring."
                : "Be the first to post a creative opportunity for the MATR community."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {hasFilters && (
                <Button variant="outline" className="rounded-full border-black/10 text-gray-700 h-10 px-5" onClick={clearFilters} data-testid="button-reset-empty-job-filters">
                  Clear Filters
                </Button>
              )}
              <Link href="/explore">
                <Button variant="outline" className="rounded-full border-black/10 text-gray-700 h-10 px-5" data-testid="button-browse-talent">Browse Talent</Button>
              </Link>
              <Link href={isAuthenticated ? "/post-job" : buildAuthHref("/sign-up", { redirectTo: "/post-job" })}>
                <Button className="bg-[#E50914] hover:bg-[#c8060f] text-white font-semibold rounded-full shadow-[0_4px_16px_rgba(229,9,20,0.28)] h-10 px-5 transition-all" data-testid="button-first-job">
                  {isAuthenticated ? "Post a Job" : "Create Account to Post"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
