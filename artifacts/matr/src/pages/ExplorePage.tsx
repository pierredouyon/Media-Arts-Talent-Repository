import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TalentCard from "@/components/TalentCard";
import { useListTalents, getListTalentsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { buildAuthHref } from "@/lib/auth-routes";

const TALENT_TYPES = [
  "Photographer", "Filmmaker", "Videographer", "Musician", "Voice Actor",
  "Graphic Designer", "Actor", "Model", "Producer", "Sound Engineer",
  "Animator", "Writer", "DJ", "Makeup Artist", "Art Director",
  "Editor", "Illustrator", "Set Designer",
];
const CITIES = ["Windsor", "Tecumseh", "LaSalle", "Amherstburg", "Essex", "Leamington"];

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialTalentType = searchParams.get("talentType") ?? "";

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedTalentTypes, setSelectedTalentTypes] = useState(
    initialTalentType
      ? initialTalentType.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
  );
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [minExperience, setMinExperience] = useState(searchParams.get("minExperience") ?? "");
  const [page, setPage] = useState(1);

  const params: Record<string, string | number> = { page, limit: 12 };
  if (search) params.search = search;
  if (city) params.city = city;
  if (minExperience) params.minExperience = Number(minExperience);
  if (selectedTalentTypes.length > 0) params.talentType = selectedTalentTypes.join(",");

  const { data, isLoading } = useListTalents(params, {
    query: { queryKey: getListTalentsQueryKey(params) },
  });

  const activeFilters = [
    city && { key: "city", label: city },
    minExperience && { key: "minExperience", label: `${minExperience}+ years` },
    ...selectedTalentTypes.map((type) => ({ key: `talentType:${type}`, label: type })),
  ].filter(Boolean) as { key: string; label: string }[];

  const toggleTalentType = (talent: string) => {
    setSelectedTalentTypes((current) => (
      current.includes(talent)
        ? current.filter((item) => item !== talent)
        : [...current, talent]
    ));
    setPage(1);
  };

  const removeFilter = (key: string) => {
    if (key === "city") setCity("");
    if (key === "minExperience") setMinExperience("");
    if (key.startsWith("talentType:")) {
      const talent = key.replace("talentType:", "");
      setSelectedTalentTypes((current) => current.filter((item) => item !== talent));
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">

      {/* ── HERO ── */}
      <div className="bg-[#080808] text-white py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="matr-dark-kicker mb-4">
                <Sparkles size={12} className="text-[#E50914]" />
                Talent Directory
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black mb-3"
              >
                Discover Talent
              </motion.h1>
              <p className="text-white/50 text-[15px] max-w-xl">
                Search our database for talent to build your cast, crew, or creative team.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-72 shrink-0">
              {[
                { value: "Location", label: "Optional filter" },
                { value: "Experience", label: "Optional filter" },
                { value: "Types", label: "Select below" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3 text-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset",
                  }}
                >
                  <p className="text-[15px] font-black text-white leading-tight">{item.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/35">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">

        {/* Filter bar + tips sidebar */}
        <div className="flex flex-col xl:flex-row gap-4 mb-6">

          {/* Main filter panel */}
          <div className="matr-premium-card p-5 xl:flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name, title, or skill..."
                  className="pl-10 h-10 rounded-full border-black/8 text-[13px] bg-[#f7f6f2]"
                  data-testid="input-explore-search"
                />
              </div>

              <Select value={city} onValueChange={(value) => { setCity(value === "all" ? "" : value); setPage(1); }}>
                <SelectTrigger className="rounded-full border-black/8 h-10 text-[13px] bg-[#f7f6f2]" data-testid="select-city">
                  <SelectValue placeholder="Location (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Location</SelectItem>
                  {CITIES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={minExperience} onValueChange={(value) => { setMinExperience(value === "all" ? "" : value); setPage(1); }}>
                <SelectTrigger className="rounded-full border-black/8 h-10 text-[13px] bg-[#f7f6f2]" data-testid="select-experience">
                  <SelectValue placeholder="Experience (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Experience</SelectItem>
                  <SelectItem value="1">1+ years</SelectItem>
                  <SelectItem value="3">3+ years</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                  <SelectItem value="10">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-black/5 pt-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <h2 className="relative z-10 text-[13px] font-semibold text-[#0a0a0a]">Talent Types</h2>
                  <p className="relative z-10 text-[11px] text-gray-400 mt-0.5">Select one or more specialties.</p>
                </div>
                {selectedTalentTypes.length > 0 && (
                  <button
                    onClick={() => { setSelectedTalentTypes([]); setPage(1); }}
                    className="text-[12px] text-gray-400 hover:text-black transition-colors shrink-0 relative z-10"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {TALENT_TYPES.map((talent) => {
                  const selected = selectedTalentTypes.includes(talent);
                  return (
                    <label
                      key={talent}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-medium transition-all cursor-pointer ${
                        selected
                          ? "border-[#0a0a0a] bg-[#0a0a0a] text-white shadow-[0_4px_14px_rgba(17,17,17,0.18)]"
                          : "border-black/8 bg-white/80 text-gray-600 hover:border-black/20 hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleTalentType(talent)}
                        className="sr-only"
                      />
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${selected ? "bg-[#E50914]" : "bg-gray-300"}`} />
                      <span className="truncate">{talent}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="relative z-10 mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-3">
                {activeFilters.map((filter) => (
                  <span
                    key={filter.key}
                    className="flex items-center gap-1.5 rounded-full bg-[#0a0a0a] px-3 py-1.5 text-[11px] font-medium text-white"
                  >
                    {filter.label}
                    <button onClick={() => removeFilter(filter.key)} className="hover:opacity-70 leading-none">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => { setSearch(""); setCity(""); setMinExperience(""); setSelectedTalentTypes([]); setPage(1); }}
                  className="text-[11px] text-gray-400 hover:text-black transition-colors self-center"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Tips sidebar */}
          <div className="matr-dark-panel p-5 text-white xl:w-60 shrink-0">
            <div className="relative z-10 flex items-center gap-2 mb-4">
              <Sparkles size={13} className="text-[#E50914]" />
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 font-semibold">Search Tips</p>
            </div>
            <div className="relative z-10 space-y-3 mb-5">
              {[
                "Start broad — one or two talent types, then narrow by city or experience.",
                "Use the checklist to compare specialties at a glance before applying filters.",
                "Open strong profiles and use next-step actions to keep moving.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-[#E50914] mt-0.5 shrink-0" />
                  <span className="text-[12px] text-white/62 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <div className="relative z-10 space-y-2">
              {[
                `${selectedTalentTypes.length || "No"} type${selectedTalentTypes.length === 1 ? "" : "s"} selected`,
                city || "Any location",
                minExperience ? `${minExperience}+ yrs experience` : "Any experience",
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-[11px] text-white/65">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-52 bg-white/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data?.talents && data.talents.length > 0 ? (
          <>
            <div className="matr-premium-card mb-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <p className="relative z-10 text-gray-500 text-[13px]" data-testid="text-results-count">
                {data.total} talent{data.total !== 1 ? "s" : ""} found
              </p>
              <div className="relative z-10 flex flex-wrap gap-2 text-[11px] text-gray-400">
                <span className="matr-chip">Public profiles</span>
                <span className="matr-chip">Location-aware</span>
                <span className="matr-chip">Ready to review</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data.talents.map((talent, i) => (
                <TalentCard key={talent.id} {...talent} index={i} />
              ))}
            </div>
            {data.total > 12 && (
              <div className="flex justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-full border-black/10 text-gray-700"
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <span className="flex items-center text-[13px] text-gray-500 px-4">
                  Page {page} of {Math.ceil(data.total / 12)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page >= Math.ceil(data.total / 12)}
                  className="rounded-full border-black/10 text-gray-700"
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="matr-premium-card w-16 h-16 flex items-center justify-center mx-auto mb-5">
              <Search size={26} className="text-gray-400 relative z-10" />
            </div>
            <h3 className="text-xl font-black text-[#0a0a0a] mb-2">No talent found</h3>
            <p className="text-gray-500 text-[14px] mb-7">Try adjusting your search or filters.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => { setSearch(""); setCity(""); setMinExperience(""); setSelectedTalentTypes([]); setPage(1); }}
                variant="outline"
                className="rounded-full border-black/10 text-gray-700"
                data-testid="button-clear-search"
              >
                Clear Search
              </Button>
              <a href="/jobs" className="inline-flex">
                <Button variant="outline" className="rounded-full border-black/10 text-gray-700">Browse Jobs</Button>
              </a>
              <a href={isAuthenticated ? "/dashboard" : buildAuthHref("/sign-up", { redirectTo: "/membership" })} className="inline-flex">
                <Button className="bg-[#E50914] hover:bg-[#c8060f] text-white rounded-full shadow-[0_4px_16px_rgba(229,9,20,0.28)] gap-2 transition-all">
                  {isAuthenticated ? "Open Dashboard" : "Create a Profile"}
                  <ArrowRight size={14} />
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
