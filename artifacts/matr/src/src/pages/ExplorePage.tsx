import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, X } from "lucide-react";
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

const TALENT_TYPES = [
  "Photographer", "Filmmaker", "Videographer", "Musician", "Voice Actor",
  "Graphic Designer", "Actor", "Model", "Producer", "Sound Engineer",
  "Animator", "Writer", "DJ", "Makeup Artist", "Art Director",
  "Editor", "Illustrator", "Set Designer",
];
const CITIES = ["Windsor", "Tecumseh", "LaSalle", "Amherstburg", "Essex", "Leamington"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function ExplorePage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [talentType, setTalentType] = useState(searchParams.get("talentType") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [gender, setGender] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const params: Record<string, string | number> = { page, limit: 12 };
  if (search) params.search = search;
  if (talentType) params.talentType = talentType;
  if (city) params.city = city;
  if (gender) params.gender = gender;
  if (minExperience) params.minExperience = Number(minExperience);
  if (maxExperience) params.maxExperience = Number(maxExperience);

  const { data, isLoading } = useListTalents(params, {
    query: { queryKey: getListTalentsQueryKey(params) },
  });

  const activeFilters = [
    talentType && { key: "talentType", label: talentType },
    city && { key: "city", label: city },
    gender && { key: "gender", label: gender },
    minExperience && { key: "minExperience", label: `Min ${minExperience}yr exp` },
  ].filter(Boolean) as { key: string; label: string }[];

  const removeFilter = (key: string) => {
    if (key === "talentType") setTalentType("");
    if (key === "city") setCity("");
    if (key === "gender") setGender("");
    if (key === "minExperience") setMinExperience("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-4"
          >
            Explore Talent
          </motion.h1>
          <p className="text-white/50 text-lg">Discover Windsor's creative professionals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, title, or skill..."
                className="pl-10 h-11 rounded-xl border-gray-200"
                data-testid="input-explore-search"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 px-4 rounded-xl border-gray-200 font-medium gap-2"
              data-testid="button-toggle-filters"
            >
              <Filter size={16} />
              Filters
              {activeFilters.length > 0 && (
                <span className="bg-[#E50914] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100"
            >
              <Select value={talentType} onValueChange={(v) => { setTalentType(v === "all" ? "" : v); setPage(1); }}>
                <SelectTrigger className="rounded-xl border-gray-200" data-testid="select-talent-type">
                  <SelectValue placeholder="Talent Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TALENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={city} onValueChange={(v) => { setCity(v === "all" ? "" : v); setPage(1); }}>
                <SelectTrigger className="rounded-xl border-gray-200" data-testid="select-city">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={gender} onValueChange={(v) => { setGender(v === "all" ? "" : v); setPage(1); }}>
                <SelectTrigger className="rounded-xl border-gray-200" data-testid="select-gender">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={minExperience} onValueChange={(v) => { setMinExperience(v === "0" ? "" : v); setPage(1); }}>
                <SelectTrigger className="rounded-xl border-gray-200" data-testid="select-experience">
                  <SelectValue placeholder="Min Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Experience</SelectItem>
                  <SelectItem value="1">1+ years</SelectItem>
                  <SelectItem value="3">3+ years</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                  <SelectItem value="10">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  className="flex items-center gap-1.5 bg-black text-white text-xs rounded-full px-3 py-1.5 font-medium"
                >
                  {filter.label}
                  <button onClick={() => removeFilter(filter.key)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setTalentType(""); setCity(""); setGender(""); setMinExperience(""); setMaxExperience(""); }}
                className="text-xs text-gray-400 hover:text-black transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data?.talents && data.talents.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-500 text-sm" data-testid="text-results-count">
                {data.total} talent{data.total !== 1 ? "s" : ""} found
              </p>
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
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl"
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-gray-500 px-4">
                  Page {page} of {Math.ceil(data.total / 12)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / 12)}
                  className="rounded-xl"
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">No talent found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            <Button
              onClick={() => { setSearch(""); setTalentType(""); setCity(""); setGender(""); setMinExperience(""); }}
              variant="outline"
              className="rounded-xl"
              data-testid="button-clear-search"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
