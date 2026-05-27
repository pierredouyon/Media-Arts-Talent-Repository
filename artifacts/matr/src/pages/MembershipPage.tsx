import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Crown, Megaphone, Users } from "lucide-react";
import PlanCard from "@/components/PlanCard";
import { useGetMembershipPlans, useSubscribeMembership } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { buildAuthHref } from "@/lib/auth-routes";

const HERO_IMAGE = `${import.meta.env.BASE_URL}opengraph.jpg`;

const PLAN_OUTCOMES = [
  {
    icon: Users,
    title: "Directory visibility",
    text: "Appear in the searchable directory with richer tags, profile details, and stronger first impressions.",
  },
  {
    icon: Crown,
    title: "Profile strength",
    text: "Upgrade your public profile so hiring teams can understand your work faster and trust what they are seeing.",
  },
  {
    icon: Megaphone,
    title: "Business reach",
    text: "Use business plans when you need hiring support, promotion tools, and stronger market presence in one account.",
  },
];

export default function MembershipPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const selectedPlanSlug = searchParams.get("plan") ?? "";
  const [planToggle, setPlanToggle] = useState<"individual" | "business">(
    selectedPlanSlug.includes("business") ? "business" : "individual",
  );
  const { data: plans, isLoading } = useGetMembershipPlans();
  const subscribeMembership = useSubscribeMembership();

  const individualPlans = plans?.filter((p) => !p.isBusinessPlan) ?? [];
  const businessPlans = plans?.filter((p) => p.isBusinessPlan) ?? [];
  const displayPlans = planToggle === "individual" ? individualPlans : businessPlans;
  const selectedPlan = plans?.find((plan) => plan.slug === selectedPlanSlug) ?? null;

  useEffect(() => {
    if (selectedPlanSlug) {
      setPlanToggle(selectedPlanSlug.includes("business") ? "business" : "individual");
    }
  }, [selectedPlanSlug]);

  const handleSelectPlan = async (slug: string) => {
    if (!user || !isAuthenticated) {
      setLocation(buildAuthHref("/sign-up", { plan: slug, redirectTo: `/membership?plan=${slug}` }));
      return;
    }
    const plan = plans?.find((entry) => entry.slug === slug);
    if (!plan) { toast({ title: "Plan not found", variant: "destructive" }); return; }
    if (user.planName === plan.name) { toast({ title: `You already have the ${plan.name} plan.` }); setLocation("/dashboard"); return; }
    try {
      await subscribeMembership.mutateAsync({ data: { userId: user.id, planSlug: slug, paypalOrderId: `SUB-${Date.now()}` } });
      toast({ title: "Membership activated", description: `${plan.name} is now attached to your account.` });
      setLocation(`/dashboard?success=membership-${encodeURIComponent(slug)}`);
    } catch { toast({ title: "Failed to activate membership", variant: "destructive" }); }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">

      {/* ── HERO ── */}
      <div className="bg-[#080808] text-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-10 items-center">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="matr-dark-kicker mb-5 inline-flex"
              >
                Membership Plans
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-3xl md:text-5xl font-black mb-4 leading-tight"
              >
                Join our creative talent directory.
              </motion.h1>
              <p className="text-white/55 text-[15px] leading-relaxed max-w-xl">
                Individual plans range from $25/year to $250/yr, with business options available when you need hiring and branding tools in the same workflow.
              </p>
            </div>

            <div
              className="relative h-[240px] md:h-[280px] overflow-hidden rounded-[1.8rem]"
              style={{
                background: "linear-gradient(135deg, #0f0f12 0%, #1a0808 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.32)",
              }}
            >
              <img
                src={HERO_IMAGE}
                alt="Creative membership preview"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute left-0 top-0 flex h-full max-w-[65%] flex-col justify-end p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E50914] mb-2">Built to convert</p>
                <p className="text-2xl font-black text-white leading-tight">
                  Pick the plan that matches how visible and active you need to be.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* Selected plan banner */}
        {selectedPlan && (
          <div
            className="mb-8 rounded-[1.5rem] p-6"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(229,9,20,0.18)",
              boxShadow: "0 8px 32px rgba(229,9,20,0.08), 0 1px 0 rgba(255,255,255,1) inset",
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#E50914] mb-2 font-bold">Selected Plan</p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-[#0a0a0a]">{selectedPlan.name}</h2>
                <p className="text-[13px] text-gray-500 mt-1">
                  {isAuthenticated
                    ? "Continue below to activate this plan on your account."
                    : "Create your account first, then you will return here ready to continue with this plan."}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#E50914]">${selectedPlan.priceYearly}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">per year</p>
              </div>
            </div>
          </div>
        )}

        {/* Outcome cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {PLAN_OUTCOMES.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="matr-premium-card p-6"
            >
              <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a0a0a] text-white mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.20)]">
                <item.icon size={17} />
              </div>
              <h2 className="relative z-10 text-[18px] font-black text-[#0a0a0a] mb-2">{item.title}</h2>
              <p className="relative z-10 text-gray-500 leading-relaxed text-[14px]">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-9">
          <div className="inline-flex bg-[#f0eeea] rounded-full p-1 border border-black/8">
            {(["individual", "business"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPlanToggle(tab)}
                className={`px-6 py-2 text-[13px] font-semibold rounded-full transition-all capitalize ${
                  planToggle === tab ? "bg-[#0a0a0a] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
                data-testid={`button-toggle-${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-white/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${displayPlans.length <= 2 ? "lg:grid-cols-2 max-w-2xl mx-auto" : "lg:grid-cols-4"}`}>
            {displayPlans.map((plan, i) => (
              <PlanCard
                key={plan.slug}
                {...plan}
                index={i}
                onSelect={handleSelectPlan}
                buttonLabel={isAuthenticated ? `Activate ${plan.name}` : "Create Account to Continue"}
              />
            ))}
          </div>
        )}

        {/* Bottom info panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="matr-premium-card p-7">
            <h3 className="relative z-10 text-xl font-black text-[#0a0a0a] mb-5">All plans include</h3>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Searchable profile in the directory",
                "Custom talent tags",
                "Location-based discovery",
                "Profile analytics",
                "Direct contact information",
                "Annual membership management",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#E50914] mt-0.5 shrink-0" />
                  <span className="text-[13px] text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="matr-dark-panel p-7">
            <p className="relative z-10 text-[10px] uppercase tracking-[0.22em] text-white/36 mb-2">Best Fit</p>
            <h3 className="relative z-10 text-xl font-black text-white mb-4 leading-snug">
              Individual if you want exposure. Business if you want reach and recruiting power.
            </h3>
            <div className="relative z-10 space-y-2.5 text-[13px] text-white/58">
              <p>Use an individual plan when your main goal is getting discovered as a creator.</p>
              <p>Use a business plan when you need to hire, promote, and maintain a stronger brand presence from one account.</p>
              <p>Every plan feeds back into the same product: directory visibility, dashboard control, and better next steps.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
