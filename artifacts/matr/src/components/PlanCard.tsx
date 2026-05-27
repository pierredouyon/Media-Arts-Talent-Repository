import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { buildAuthHref } from "@/lib/auth-routes";

interface PlanCardProps {
  name: string;
  slug: string;
  priceYearly: number;
  description: string;
  features: string[];
  isMostPopular: boolean;
  isBusinessPlan: boolean;
  jobCredits: number;
  index?: number;
  onSelect?: (slug: string) => void;
  buttonLabel?: string;
}

export default function PlanCard({
  name,
  slug,
  priceYearly,
  description,
  features,
  isMostPopular,
  isBusinessPlan,
  jobCredits,
  index = 0,
  onSelect,
  buttonLabel,
}: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <div
        className={`relative h-full flex flex-col p-5 rounded-[1.5rem] transition-all duration-300 ${
          isMostPopular
            ? "shadow-[0_0_0_2px_#E50914,0_20px_60px_rgba(229,9,20,0.12)]"
            : "shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_12px_48px_rgba(15,23,42,0.08)] border border-white/70 hover:shadow-[0_20px_64px_rgba(15,23,42,0.11)]"
        }`}
        style={{
          background: isMostPopular
            ? "linear-gradient(160deg, #0f0f12 0%, #1a0808 100%)"
            : "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,248,250,0.96) 100%)",
          backdropFilter: "blur(40px) saturate(160%)",
          WebkitBackdropFilter: "blur(40px) saturate(160%)",
        }}
        data-testid={`card-plan-${slug}`}
      >
        {isMostPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-[#E50914] text-white text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(229,9,20,0.38)]">
              Most Popular
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
              isMostPopular
                ? "bg-white/12 text-white/80 border border-white/12"
                : isBusinessPlan
                  ? "bg-[#0a0a0a] text-white"
                  : "bg-black/6 text-gray-600 border border-black/8"
            }`}>
              {isBusinessPlan ? "Business" : "Individual"}
            </span>
            {jobCredits > 0 && (
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                isMostPopular
                  ? "bg-[#E50914]/20 text-[#ff6b72] border border-[#E50914]/20"
                  : "bg-[#E50914]/8 text-[#E50914] border border-[#E50914]/12"
              }`}>
                {jobCredits} job credit{jobCredits !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h3 className={`text-[18px] font-black mb-1 ${isMostPopular ? "text-white" : "text-[#0a0a0a]"}`} data-testid={`text-plan-name-${slug}`}>
            {name}
          </h3>
          <p className={`text-[13px] leading-relaxed ${isMostPopular ? "text-white/55" : "text-gray-500"}`}>{description}</p>
        </div>

        {/* Price */}
        <div
          className={`mb-5 rounded-[1.2rem] p-4 ${
            isMostPopular
              ? "border border-white/10 bg-white/6"
              : "border border-black/6 bg-white/60"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-baseline gap-1">
            <span className={`text-[2.4rem] font-black leading-none ${isMostPopular ? "text-white" : "text-[#0a0a0a]"}`} data-testid={`text-price-${slug}`}>
              ${priceYearly}
            </span>
            <span className={`text-[13px] ml-1 ${isMostPopular ? "text-white/45" : "text-gray-400"}`}>/year</span>
          </div>
          <p className={`mt-1.5 text-[11px] leading-relaxed ${isMostPopular ? "text-white/40" : "text-gray-400"}`}>
            {isBusinessPlan
              ? "Built for hiring, promotion, and higher visibility."
              : "Built for public discovery and portfolio growth."}
          </p>
        </div>

        {/* Features */}
        <ul className="mb-5 flex-1 space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className={`flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5 ${
                isMostPopular ? "bg-[#E50914]/20" : "bg-green-50 border border-green-200"
              }`}>
                <Check size={9} className={isMostPopular ? "text-[#ff6b72] stroke-[3]" : "text-green-600 stroke-[3]"} />
              </div>
              <span className={`text-[13px] leading-relaxed ${isMostPopular ? "text-white/72" : "text-gray-600"}`}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {onSelect ? (
          <Button
            onClick={() => onSelect(slug)}
            className={`w-full rounded-full font-bold text-[13px] h-10 transition-all ${
              isMostPopular
                ? "bg-[#E50914] hover:bg-[#c8060f] text-white shadow-[0_4px_16px_rgba(229,9,20,0.40)]"
                : "bg-[#0a0a0a] hover:bg-gray-800 text-white"
            }`}
            data-testid={`button-select-plan-${slug}`}
          >
            {buttonLabel ?? `Choose ${name}`}
          </Button>
        ) : (
          <Link href={buildAuthHref("/sign-up", { plan: slug, redirectTo: `/membership?plan=${encodeURIComponent(slug)}` })}>
            <Button
              className={`w-full rounded-full font-bold text-[13px] h-10 transition-all ${
                isMostPopular
                  ? "bg-[#E50914] hover:bg-[#c8060f] text-white shadow-[0_4px_16px_rgba(229,9,20,0.40)]"
                  : "bg-[#0a0a0a] hover:bg-gray-800 text-white"
              }`}
              data-testid={`button-get-plan-${slug}`}
            >
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
