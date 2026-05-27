import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TalentCardProps {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  city: string;
  province: string;
  planName?: string | null;
  profilePhotoUrl?: string | null;
  talentTags: string[];
  yearsExperience?: number | null;
  index?: number;
}

const planColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Platinum Business": { bg: "bg-purple-50 border border-purple-200", text: "text-purple-700", dot: "bg-purple-400" },
  "Gold Business":    { bg: "bg-amber-50 border border-amber-200",   text: "text-amber-700",  dot: "bg-amber-400" },
  Gold:               { bg: "bg-amber-50 border border-amber-200",   text: "text-amber-700",  dot: "bg-amber-400" },
  Silver:             { bg: "bg-gray-50 border border-gray-200",     text: "text-gray-600",   dot: "bg-gray-400" },
  Bronze:             { bg: "bg-orange-50 border border-orange-200", text: "text-orange-700", dot: "bg-orange-400" },
  Friend:             { bg: "bg-blue-50 border border-blue-200",     text: "text-blue-700",   dot: "bg-blue-400" },
};

const isPremium = (plan?: string | null) =>
  plan === "Gold" || plan === "Gold Business" || plan === "Platinum Business";

export default function TalentCard({
  id,
  firstName,
  lastName,
  jobTitle,
  city,
  province,
  planName,
  profilePhotoUrl,
  talentTags,
  yearsExperience,
  index = 0,
}: TalentCardProps) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const colors = planName ? planColors[planName] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link href={`/talent/${id}`} data-testid={`card-talent-${id}`}>
        <div className="matr-premium-card flex flex-col h-full cursor-pointer p-5 transition-all duration-300">
          {/* Avatar + name row */}
          <div className="relative z-10 flex items-start gap-3 mb-4">
            <div className="relative shrink-0">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="h-[52px] w-[52px] rounded-[0.9rem] object-cover"
                  data-testid={`img-avatar-${id}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[0.9rem]"
                  style={{
                    background: "linear-gradient(135deg, #1a1a1e 0%, #2d2d34 100%)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
                  }}
                >
                  <span className="text-white font-bold text-base">{initials}</span>
                </div>
              )}
              {isPremium(planName) && (
                <div className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E50914] shadow-[0_3px_10px_rgba(229,9,20,0.40)]">
                  <Star size={8} className="text-white fill-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {colors ? (
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full mb-1.5 ${colors.bg} ${colors.text}`}>
                  <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
                  {planName}
                </span>
              ) : (
                <span className="inline-flex text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full mb-1.5 border border-black/8 bg-black/4 text-gray-400">
                  Free
                </span>
              )}
              <h3 className="font-bold text-[#0a0a0a] text-[15px] leading-tight truncate" data-testid={`text-name-${id}`}>
                {firstName} {lastName}
              </h3>
              {jobTitle && (
                <p className="text-gray-500 text-[12px] truncate mt-0.5" data-testid={`text-title-${id}`}>
                  {jobTitle}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} className="text-gray-400 shrink-0" />
                <span className="text-gray-400 text-[11px] truncate">
                  {city}, {province}
                </span>
              </div>
            </div>

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white self-start mt-0.5">
              <ArrowUpRight size={13} className="text-gray-400" />
            </div>
          </div>

          {/* Tags */}
          <div className="relative z-10 flex flex-wrap gap-1.5 flex-1 content-start">
            {talentTags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full border border-black/8 bg-black/4 text-gray-600 text-[11px] px-2.5 py-0.5 h-auto font-medium"
              >
                {tag}
              </Badge>
            ))}
            {talentTags.length > 3 && (
              <Badge
                variant="secondary"
                className="rounded-full border border-black/8 bg-black/4 text-gray-400 text-[11px] px-2.5 py-0.5 h-auto font-medium"
              >
                +{talentTags.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-4 flex items-center justify-between border-t border-black/5 pt-3">
            <p className="text-gray-400 text-[11px] font-medium">
              {yearsExperience !== null && yearsExperience !== undefined
                ? `${yearsExperience} yr${yearsExperience !== 1 ? "s" : ""} exp.`
                : "No exp. listed"}
            </p>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E50914]">
              Open Profile
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
