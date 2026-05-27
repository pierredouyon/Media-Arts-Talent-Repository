import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Monitor, BarChart2, Eye, CheckCircle2, Megaphone, MousePointerClick, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateAd } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { buildAuthHref } from "@/lib/auth-routes";

const AD_PLACEMENTS = [
  {
    id: "sidebar",
    name: "Sidebar Advertisement",
    price: 30,
    dimensions: "300 × 250px",
    description: "Maximum visibility. Your ad appears in the sidebar on the major directory pages.",
    impressions: "~5,000/month estimated",
    badge: "Most Visible",
  },
  {
    id: "footer",
    name: "Footer Advertisement",
    price: 15,
    dimensions: "728 × 90px",
    description: "Cost-effective brand exposure across the site footer.",
    impressions: "~8,000/month estimated",
    badge: "Best Value",
  },
];

const STEPS = [
  { id: "choose", label: "Choose Placement" },
  { id: "details", label: "Add Details" },
  { id: "pay", label: "Review and Pay" },
] as const;

export default function AdvertisePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const createAd = useCreateAd();

  const [selected, setSelected] = useState<"sidebar" | "footer" | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [step, setStep] = useState<"choose" | "details" | "pay">("choose");

  const selectedPlacement = AD_PLACEMENTS.find((p) => p.id === selected);
  const currentStepIndex = STEPS.findIndex((item) => item.id === step);

  const handleNext = () => {
    if (!selected) { toast({ title: "Please choose a placement", variant: "destructive" }); return; }
    if (step === "choose") { setStep("details"); return; }
    if (step === "details") {
      if (!imageUrl || !linkUrl) { toast({ title: "Please fill in all required fields", variant: "destructive" }); return; }
      setStep("pay");
    }
  };

  const handlePay = async () => {
    if (!user) { toast({ title: "Please sign in to create an ad", variant: "destructive" }); setLocation(buildAuthHref("/sign-in", { redirectTo: "/advertise" })); return; }
    try {
      await createAd.mutateAsync({ data: { userId: user.id, placement: selected!, imageUrl, linkUrl, altText: altText || null, paypalOrderId: `AD-${Date.now()}` } });
      toast({ title: "Advertisement submitted", description: "Your placement is now attached to your account dashboard." });
      setLocation("/dashboard?success=ad-created");
    } catch { toast({ title: "Failed to create ad", variant: "destructive" }); }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">

      {/* ── HERO ── */}
      <div className="bg-[#080808] text-white py-14 lg:py-18">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3 mb-5">
            <Megaphone className="text-[#E50914]" size={22} />
            <span className="matr-dark-kicker inline-flex">Advertising</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">Advertise</h1>
          <p className="text-white/50 text-[15px] max-w-xl">
            Promote your brand, project, or service to the MATR audience, then manage the placement from your dashboard.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 mt-8 max-w-2xl">
            {[
              { icon: Eye, value: "Visible", label: "Across core pages" },
              { icon: Users, value: "Creative", label: "Audience fit" },
              { icon: MousePointerClick, value: "Simple", label: "Dashboard management" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset",
                }}
              >
                <item.icon size={15} className="text-[#E50914] mb-2.5" />
                <p className="text-xl font-black text-white leading-tight">{item.value}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/32 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-10">

        {/* Not signed in */}
        {!isLoading && !isAuthenticated ? (
          <div className="matr-premium-card p-10 text-center">
            <Megaphone size={32} className="text-[#E50914] mx-auto mb-4 relative z-10" />
            <h2 className="relative z-10 text-xl font-black text-[#0a0a0a] mb-2">Sign in to get started</h2>
            <p className="relative z-10 text-gray-500 text-[14px] mb-7">Sign in first to create and manage ad placements.</p>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <Link href={buildAuthHref("/sign-in", { redirectTo: "/advertise" })}>
                <Button className="bg-[#E50914] hover:bg-[#c8060f] text-white font-semibold rounded-full h-10 px-6 shadow-[0_4px_16px_rgba(229,9,20,0.28)]">Sign In</Button>
              </Link>
              <Link href={buildAuthHref("/sign-up", { redirectTo: "/advertise" })}>
                <Button variant="outline" className="rounded-full border-black/10 text-gray-700 h-10 px-6">Create Account</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {STEPS.map((item, index) => {
                const active = index === currentStepIndex;
                const complete = index < currentStepIndex;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl p-4 transition-all"
                    style={
                      active
                        ? { background: "linear-gradient(160deg, #0f0f12, #0a0a0a)", border: "1px solid rgba(255,255,255,0.09)", color: "white" }
                        : complete
                          ? { background: "rgba(229,9,20,0.06)", border: "1px solid rgba(229,9,20,0.16)", color: "#0a0a0a" }
                          : { background: "rgba(255,255,255,0.70)", border: "1px solid rgba(0,0,0,0.07)", color: "#9ca3af" }
                    }
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-60">{`Step ${index + 1}`}</p>
                    <p className="font-semibold text-[14px]">{item.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Step: Choose */}
            {step === "choose" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-black text-[#0a0a0a] mb-2">Choose Your Placement</h2>
                <p className="text-gray-500 text-[14px] mb-7">
                  Select the visibility level that fits your campaign, then add the destination and asset details.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {AD_PLACEMENTS.map((placement, index) => (
                    <motion.div
                      key={placement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => setSelected(placement.id as "sidebar" | "footer")}
                      className="cursor-pointer transition-all"
                      data-testid={`card-placement-${placement.id}`}
                    >
                      <div
                        className="h-full p-6 rounded-[1.5rem] transition-all"
                        style={
                          selected === placement.id
                            ? {
                                background: "rgba(255,255,255,0.95)",
                                border: "2px solid #E50914",
                                boxShadow: "0 0 0 4px rgba(229,9,20,0.08), 0 12px 48px rgba(229,9,20,0.10)",
                                backdropFilter: "blur(40px)",
                                WebkitBackdropFilter: "blur(40px)",
                              }
                            : {
                                background: "rgba(255,255,255,0.80)",
                                border: "1px solid rgba(255,255,255,0.70)",
                                boxShadow: "0 1px 0 rgba(255,255,255,1) inset, 0 8px 32px rgba(15,23,42,0.07)",
                                backdropFilter: "blur(40px)",
                                WebkitBackdropFilter: "blur(40px)",
                              }
                        }
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-black text-[#0a0a0a] text-[17px]">{placement.name}</h3>
                          <span className="text-[11px] bg-[#0a0a0a] text-white px-2.5 py-1 rounded-full font-bold ml-2 shrink-0">
                            {placement.badge}
                          </span>
                        </div>
                        <div className="text-[2rem] font-black text-[#E50914] mb-1 leading-tight">
                          ${placement.price}<span className="text-[14px] text-gray-400 font-normal">/month</span>
                        </div>
                        <p className="text-gray-500 text-[13px] mb-4">{placement.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[12px] text-gray-400">
                            <Eye size={12} />
                            <span>{placement.impressions}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-gray-400">
                            <Monitor size={12} />
                            <span>{placement.dimensions}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4 mb-6">
                  <div className="matr-premium-card p-6">
                    <h3 className="relative z-10 font-black text-[#0a0a0a] text-[16px] mb-4 flex items-center gap-2">
                      <BarChart2 size={16} className="text-[#E50914]" />
                      Platform Reach
                    </h3>
                    <div className="relative z-10 grid grid-cols-3 gap-4">
                      {[
                        { value: "500+", label: "Creative Professionals" },
                        { value: "2,000+", label: "Monthly Visitors" },
                        { value: "Windsor", label: "Hyper-local" },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className="text-xl font-black text-[#0a0a0a]">{stat.value}</p>
                          <p className="text-[11px] text-gray-400 mt-1 leading-tight">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="matr-dark-panel p-6">
                    <p className="relative z-10 text-[10px] uppercase tracking-[0.22em] text-white/36 mb-3">What Happens Next</p>
                    <div className="relative z-10 space-y-2.5">
                      {[
                        "Choose the placement that fits your campaign.",
                        "Add the image link, destination URL, and accessibility text.",
                        "Review the order, pay, and manage from your dashboard.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-[#E50914] mt-0.5 shrink-0" />
                          <span className="text-[12px] text-white/58 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!selected}
                  className="w-full h-12 bg-[#E50914] hover:bg-[#c8060f] text-white font-bold rounded-full text-[15px] shadow-[0_4px_20px_rgba(229,9,20,0.30)] transition-all disabled:opacity-40"
                  data-testid="button-proceed-ad"
                >
                  Continue with {selectedPlacement?.name ?? "Selected Placement"}
                </Button>
              </motion.div>
            )}

            {/* Step: Details */}
            {step === "details" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-black text-[#0a0a0a] mb-1">Ad Details</h2>
                <p className="text-gray-500 text-[14px] mb-7">
                  {selectedPlacement?.name} — ${selectedPlacement?.price}/month
                </p>

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
                  <div className="matr-premium-card p-7 space-y-5">
                    {[
                      { label: "Ad Image URL *", value: imageUrl, setter: setImageUrl, placeholder: "https://your-ad-image.com/banner.jpg", hint: `Recommended: ${selectedPlacement?.dimensions}`, testid: "input-image-url" },
                      { label: "Destination URL *", value: linkUrl, setter: setLinkUrl, placeholder: "https://yourwebsite.com", testid: "input-link-url" },
                      { label: "Alt Text", value: altText, setter: setAltText, placeholder: "Brief description of your ad", testid: "input-alt-text" },
                    ].map((field) => (
                      <div key={field.label} className="relative z-10">
                        <Label className="font-semibold text-[13px] text-[#0a0a0a]">{field.label}</Label>
                        <Input
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          className="mt-1.5 rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]"
                          placeholder={field.placeholder}
                          data-testid={field.testid}
                        />
                        {field.hint && <p className="text-[11px] text-gray-400 mt-1">{field.hint}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="matr-premium-card p-6">
                    <h3 className="relative z-10 font-black text-[#0a0a0a] text-[16px] mb-4">Submission Checklist</h3>
                    <div className="relative z-10 space-y-3">
                      {[
                        "Use a direct image URL that can be rendered publicly.",
                        "Send traffic to the exact landing page you want people to visit.",
                        "Add alt text so the placement remains accessible.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 size={14} className="text-[#E50914] mt-0.5 shrink-0" />
                          <span className="text-[13px] text-gray-600 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <Button variant="outline" onClick={() => setStep("choose")} className="rounded-full border-black/10 text-gray-700 h-11 px-6" data-testid="button-back-choose">Back</Button>
                  <Button onClick={handleNext} className="flex-1 h-11 bg-[#E50914] hover:bg-[#c8060f] text-white font-bold rounded-full shadow-[0_4px_20px_rgba(229,9,20,0.28)] transition-all" data-testid="button-proceed-payment">
                    Proceed to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Pay */}
            {step === "pay" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-black text-[#0a0a0a] mb-7">Review and Pay</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="matr-premium-card p-6">
                    <h3 className="relative z-10 font-black text-[#0a0a0a] text-[16px] mb-4">Order Summary</h3>
                    <div className="relative z-10 space-y-3 border-b border-black/5 pb-4 mb-4">
                      {[
                        { label: "Placement", value: selectedPlacement?.name },
                        { label: "Duration", value: "1 month" },
                        { label: "Destination", value: linkUrl },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between gap-3">
                          <span className="text-gray-400 text-[13px]">{row.label}</span>
                          <span className="font-medium text-[13px] text-right break-all">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10 flex justify-between font-black text-lg">
                      <span>Total</span>
                      <span className="text-[#E50914]">${selectedPlacement?.price}.00/month</span>
                    </div>
                  </div>

                  <div className="matr-premium-card p-6">
                    <h3 className="relative z-10 font-black text-[#0a0a0a] text-[16px] mb-3">Payment</h3>
                    <p className="relative z-10 text-gray-500 text-[13px] mb-6">
                      Complete payment securely with PayPal. The placement will appear in your dashboard right after submission.
                    </p>
                    <Button
                      onClick={handlePay}
                      disabled={createAd.isPending}
                      className="relative z-10 w-full h-11 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-full transition-all"
                      data-testid="button-paypal-ad"
                    >
                      {createAd.isPending ? "Processing..." : `Pay $${selectedPlacement?.price} with PayPal`}
                    </Button>
                    <p className="relative z-10 text-[11px] text-gray-400 text-center mt-3">Sandbox mode</p>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setStep("details")} className="mt-4 rounded-full border-black/10 text-gray-700 h-10 px-5" data-testid="button-back-details">
                  Edit Ad Details
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
