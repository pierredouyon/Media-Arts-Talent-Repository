import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Search, Briefcase, Monitor, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TalentCard from "@/components/TalentCard";
import PlanCard from "@/components/PlanCard";
import { useGetFeaturedTalents, useGetMembershipPlans } from "@workspace/api-client-react";

const TALENT_TYPES = [
  "Photographer", "Filmmaker", "Videographer", "Musician", "Voice Actor",
  "Graphic Designer", "Actor", "Model", "Producer", "Sound Engineer",
  "Animator", "Writer", "DJ", "Makeup Artist", "Art Director",
];

const CITIES = ["Windsor", "Tecumseh", "LaSalle", "Amherstburg", "Essex", "Leamington"];

export default function HomePage() {
  const [planToggle, setPlanToggle] = useState<"individual" | "business">("individual");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredTalents, isLoading: loadingTalents } = useGetFeaturedTalents();
  const { data: plans, isLoading: loadingPlans } = useGetMembershipPlans();

  const individualPlans = plans?.filter((p) => !p.isBusinessPlan) ?? [];
  const businessPlans = plans?.filter((p) => p.isBusinessPlan) ?? [];
  const displayPlans = planToggle === "individual" ? individualPlans : businessPlans;

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, #E50914 0%, transparent 60%), radial-gradient(circle at 80% 20%, #444 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8"
            >
              <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Media Arts Talent Repository</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
              Connect with the{" "}
              <span className="text-[#E50914]">creative pulse</span>{" "}
              of Windsor
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              Discover Windsor's most talented photographers, filmmakers, musicians, designers, and creative professionals.
              The definitive directory for the region's media arts community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="bg-[#E50914] hover:bg-[#b40710] text-white font-bold text-base px-8 h-12 rounded-xl group"
                  data-testid="button-explore-talent"
                >
                  Explore Talent
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-bold text-base px-8 h-12 rounded-xl backdrop-blur-sm"
                  data-testid="button-join-directory"
                >
                  Join the Directory
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-sm">
              {[
                { value: "500+", label: "Creative Professionals" },
                { value: "15+", label: "Talent Types" },
                { value: "Windsor", label: "Based" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="text-white/40" size={28} />
        </motion.div>
      </section>

      {/* MEMBERSHIP SECTION */}
      <section className="py-20 bg-[#F5F5F5]" id="membership">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From emerging creatives to established studios — find the right membership for your needs.
            </p>

            <div className="mt-8 inline-flex bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
              <button
                onClick={() => setPlanToggle("individual")}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                  planToggle === "individual"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
                data-testid="button-toggle-individual"
              >
                Individual
              </button>
              <button
                onClick={() => setPlanToggle("business")}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                  planToggle === "business"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
                data-testid="button-toggle-business"
              >
                Business
              </button>
            </div>
          </motion.div>

          {loadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${displayPlans.length <= 2 ? "lg:grid-cols-2 max-w-2xl mx-auto" : "lg:grid-cols-4"}`}>
              {displayPlans.map((plan, i) => (
                <PlanCard key={plan.slug} {...plan} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FIND TALENT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Find the Right Talent
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Search Windsor's creative community by skill, location, experience, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, talent, or keyword..."
                  className="pl-10 h-12 rounded-xl border-gray-200 text-base"
                  data-testid="input-search-talent"
                />
              </div>
              <Link href={`/explore${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`}>
                <Button
                  size="lg"
                  className="bg-[#E50914] hover:bg-[#b40710] text-white font-semibold h-12 px-6 rounded-xl"
                  data-testid="button-search-submit"
                >
                  Search
                </Button>
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 mr-1">Popular:</span>
              {TALENT_TYPES.slice(0, 6).map((type) => (
                <Link key={type} href={`/explore?talentType=${encodeURIComponent(type)}`}>
                  <span className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 cursor-pointer transition-colors">
                    {type}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {loadingTalents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredTalents && featuredTalents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredTalents.slice(0, 8).map((talent, i) => (
                  <TalentCard key={talent.id} {...talent} index={i} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/explore">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-black text-black hover:bg-black hover:text-white font-semibold px-8 rounded-xl"
                    data-testid="button-view-all-talent"
                  >
                    View All Talent
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-6">No talent profiles yet. Be the first to join!</p>
              <Link href="/sign-up">
                <Button className="bg-[#E50914] hover:bg-[#b40710] text-white font-semibold">
                  Join the Directory
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* JOB BOARD */}
      <section className="py-20 bg-[#222222] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 mb-6">
                <Briefcase size={14} className="text-[#E50914]" />
                <span className="text-white/70 text-sm font-medium">Job Board</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Hire Local Creative Talent
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Connect with Windsor's creative professionals through our job board. Each posting stays live for 2 months, reaching hundreds of local artists, filmmakers, musicians, and designers.
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-[#E50914]">$100</span>
                <span className="text-white/50">per posting / 2 months</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/post-job">
                  <Button
                    size="lg"
                    className="bg-[#E50914] hover:bg-[#b40710] text-white font-bold px-8 h-12 rounded-xl"
                    data-testid="button-post-job"
                  >
                    Post a Job
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-12 rounded-xl"
                    data-testid="button-browse-jobs"
                  >
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                { title: "Videographer Needed", company: "Windsor Film Co.", category: "Videography", city: "Windsor" },
                { title: "Graphic Designer", company: "Creative Studio", category: "Design", city: "LaSalle" },
                { title: "Voice Actor for Commercial", company: "Media Agency", category: "Voice Acting", city: "Windsor" },
              ].map((job, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white">{job.title}</h4>
                      <p className="text-white/50 text-sm mt-1">{job.company} — {job.city}</p>
                    </div>
                    <span className="text-xs bg-[#E50914]/20 text-[#E50914] px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                      {job.category}
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-white/30 text-sm text-center pt-2">Sample job postings</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ADVERTISING */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 mb-6">
              <Monitor size={14} className="text-gray-500" />
              <span className="text-gray-500 text-sm font-medium">Advertising</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Reach Windsor's Creative Community
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Promote your brand, studio, or service to hundreds of engaged creative professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Sidebar Advertisement",
                price: "$30/month",
                description: "Prominent sidebar placement visible on every page of the directory. High visibility, maximum impressions.",
                specs: "300 × 250px recommended",
                badge: "Most Visible",
              },
              {
                name: "Footer Advertisement",
                price: "$15/month",
                description: "Footer banner appearing on all pages. Cost-effective brand exposure to the entire MATR community.",
                specs: "728 × 90px recommended",
                badge: "Best Value",
              },
            ].map((ad, i) => (
              <motion.div
                key={ad.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="border border-gray-200 rounded-2xl p-7 hover:border-gray-300 hover:shadow-md transition-all h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">{ad.name}</h3>
                    <span className="text-xs bg-black text-white px-2.5 py-1 rounded-full font-semibold">
                      {ad.badge}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-[#E50914] mb-3">{ad.price}</div>
                  <p className="text-gray-500 text-sm mb-4">{ad.description}</p>
                  <p className="text-gray-400 text-xs mb-6 font-mono">{ad.specs}</p>
                  <Link href="/advertise">
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl"
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

      {/* CTA */}
      <section className="py-20 bg-[#E50914]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to showcase your talent?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Join Windsor's definitive creative directory. Plans start at just $25/year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-[#E50914] hover:bg-gray-100 font-bold px-10 h-12 rounded-xl"
                  data-testid="button-cta-join"
                >
                  Join the Directory
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 font-bold px-10 h-12 rounded-xl"
                  data-testid="button-cta-explore"
                >
                  Explore First
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
