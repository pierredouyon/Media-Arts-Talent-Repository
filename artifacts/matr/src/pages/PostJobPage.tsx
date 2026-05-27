import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, ClipboardList, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateJob } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { buildAuthHref } from "@/lib/auth-routes";

const CATEGORIES = [
  "Photography", "Film & Video", "Music", "Graphic Design", "Voice Acting",
  "Acting & Performance", "Modeling", "Production", "Sound Engineering",
  "Animation", "Writing & Content", "DJ & Events", "Makeup & Beauty",
  "Art Direction", "Editing", "Illustration",
];

const STEPS = [
  { id: "form", label: "Role Details" },
  { id: "pay", label: "Review and Pay" },
] as const;

export default function PostJobPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const createJob = useCreateJob();

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    category: "",
    city: "Windsor",
    province: "ON",
    compensation: "",
    contactEmail: "",
  });

  const [step, setStep] = useState<"form" | "pay">("form");

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (!form.title || !form.company || !form.description || !form.category || !form.contactEmail) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setStep("pay");
  };

  const handlePay = async () => {
    if (!user) {
      toast({ title: "Please sign in to post a job", variant: "destructive" });
      setLocation(buildAuthHref("/sign-in", { redirectTo: "/post-job" }));
      return;
    }
    try {
      await createJob.mutateAsync({ data: { ...form, userId: user.id, paypalOrderId: `JOB-${Date.now()}` } });
      toast({ title: "Job posted successfully", description: "Your listing is now live and visible on the job board." });
      setLocation("/dashboard?success=job-posted");
    } catch {
      toast({ title: "Failed to post job", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">

      {/* ── HERO ── */}
      <div className="bg-[#080808] text-white py-14 lg:py-18">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3 mb-5">
            <Briefcase className="text-[#E50914]" size={22} />
            <span className="matr-dark-kicker inline-flex">Hiring</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">Post a Job</h1>
          <p className="text-white/50 text-[15px] max-w-xl">
            Reach the MATR talent community with a role that is structured clearly and ready for applicants to act on.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 mt-8 max-w-2xl">
            {[
              { icon: Users, value: "Targeted", label: "Creative audience" },
              { icon: MapPin, value: "Local", label: "City-based discovery" },
              { icon: ClipboardList, value: "$100", label: "2 months live" },
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
            <Briefcase size={32} className="text-[#E50914] mx-auto mb-4 relative z-10" />
            <h2 className="relative z-10 text-xl font-black text-[#0a0a0a] mb-2">Sign in to post a job</h2>
            <p className="relative z-10 text-gray-500 text-[14px] mb-7">Sign in first to post a job to the directory.</p>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <Link href={buildAuthHref("/sign-in", { redirectTo: "/post-job" })}>
                <Button className="bg-[#E50914] hover:bg-[#c8060f] text-white font-semibold rounded-full h-10 px-6 shadow-[0_4px_16px_rgba(229,9,20,0.28)]">Sign In</Button>
              </Link>
              <Link href={buildAuthHref("/sign-up", { redirectTo: "/post-job" })}>
                <Button variant="outline" className="rounded-full border-black/10 text-gray-700 h-10 px-6">Create Account</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Step indicators */}
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {STEPS.map((item, index) => {
                const active = step === item.id;
                const complete = index === 0 && step === "pay";
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

            {/* Form step */}
            {step === "form" ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-5">
                  <div className="matr-premium-card p-7 space-y-5">
                    {[
                      { label: "Job Title *", key: "title", placeholder: "e.g. Freelance Videographer Needed", testid: "input-job-title" },
                      { label: "Company / Organization *", key: "company", placeholder: "Your company name", testid: "input-company" },
                      { label: "Contact Email *", key: "contactEmail", placeholder: "hiring@yourcompany.com", type: "email", testid: "input-contact-email" },
                      { label: "Compensation (optional)", key: "compensation", placeholder: "e.g. $500-800, negotiable, or TBD", testid: "input-compensation" },
                    ].map((field) => (
                      <div key={field.key} className="relative z-10">
                        <Label className="font-semibold text-[13px] text-[#0a0a0a]">{field.label}</Label>
                        <Input
                          value={form[field.key as keyof typeof form]}
                          onChange={(e) => updateForm(field.key, e.target.value)}
                          className="mt-1.5 rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]"
                          placeholder={field.placeholder}
                          type={field.type}
                          data-testid={field.testid}
                        />
                      </div>
                    ))}

                    <div className="relative z-10">
                      <Label className="font-semibold text-[13px] text-[#0a0a0a]">Category *</Label>
                      <Select value={form.category} onValueChange={(value) => updateForm("category", value)}>
                        <SelectTrigger className="mt-1.5 rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]" data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold text-[13px] text-[#0a0a0a]">City</Label>
                        <Input value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="mt-1.5 rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]" data-testid="input-city" />
                      </div>
                      <div>
                        <Label className="font-semibold text-[13px] text-[#0a0a0a]">Province</Label>
                        <Input value={form.province} onChange={(e) => updateForm("province", e.target.value)} className="mt-1.5 rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]" data-testid="input-province" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <Label className="font-semibold text-[13px] text-[#0a0a0a]">Job Description *</Label>
                      <Textarea
                        value={form.description}
                        onChange={(e) => updateForm("description", e.target.value)}
                        className="mt-1.5 rounded-xl border-black/8 bg-[#f7f6f2] text-[14px] min-h-[130px]"
                        placeholder="Describe the role, requirements, schedule, and what success looks like."
                        data-testid="textarea-description"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="matr-premium-card p-6">
                      <h3 className="relative z-10 font-black text-[#0a0a0a] text-[16px] mb-4 flex items-center gap-2">
                        <ClipboardList size={16} className="text-[#E50914]" />
                        Posting Checklist
                      </h3>
                      <div className="relative z-10 space-y-3">
                        {[
                          "Name the exact role you are hiring for.",
                          "Describe the schedule, location, and expected responsibilities.",
                          "Include contact information that will be monitored.",
                        ].map((item) => (
                          <div key={item} className="flex items-start gap-2.5">
                            <CheckCircle2 size={14} className="text-[#E50914] mt-0.5 shrink-0" />
                            <span className="text-[13px] text-gray-600 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="matr-dark-panel p-6">
                      <p className="relative z-10 text-[10px] uppercase tracking-[0.22em] text-white/36 mb-2">Pricing</p>
                      <p className="relative z-10 text-3xl font-black text-white mb-2">$100</p>
                      <p className="relative z-10 text-[13px] text-white/58 mb-4">
                        Each posting runs for two months and appears on the public MATR job board after checkout.
                      </p>
                      <p className="relative z-10 text-[11px] text-white/36">
                        You will return to your dashboard after submission so the posting is easy to track.
                      </p>
                    </div>

                    <div className="matr-premium-card p-6">
                      <h3 className="relative z-10 font-black text-[#0a0a0a] text-[16px] mb-4">What a strong listing includes</h3>
                      <div className="relative z-10 space-y-3">
                        {[
                          "A specific title creators immediately recognize.",
                          "Enough detail to understand schedule, expectations, and compensation.",
                          "A contact email that is monitored and ready for replies.",
                        ].map((item) => (
                          <div key={item} className="flex items-start gap-2.5">
                            <CheckCircle2 size={14} className="text-[#E50914] mt-0.5 shrink-0" />
                            <span className="text-[13px] text-gray-600 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="mt-5 w-full h-12 bg-[#E50914] hover:bg-[#c8060f] text-white font-bold rounded-full text-[15px] shadow-[0_4px_20px_rgba(229,9,20,0.30)] transition-all"
                  data-testid="button-proceed-to-payment"
                >
                  Proceed to Payment — $100
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="matr-premium-card p-6">
                    <h3 className="relative z-10 font-black text-[#0a0a0a] text-[17px] mb-4">Order Summary</h3>
                    <div className="relative z-10 space-y-3 border-b border-black/5 pb-4 mb-4">
                      {[
                        { label: "Job Posting", value: form.title },
                        { label: "Duration", value: "2 months" },
                        { label: "Company", value: form.company },
                        { label: "Location", value: `${form.city}, ${form.province}` },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between gap-3">
                          <span className="text-gray-400 text-[13px]">{row.label}</span>
                          <span className="font-medium text-[13px] text-right break-all">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10 flex justify-between font-black text-lg">
                      <span>Total</span>
                      <span className="text-[#E50914]">$100.00</span>
                    </div>
                  </div>

                  <div className="matr-premium-card p-6">
                    <h3 className="relative z-10 font-black text-[#0a0a0a] text-[17px] mb-3">Payment</h3>
                    <p className="relative z-10 text-gray-500 text-[13px] mb-6">
                      Complete payment securely with PayPal. Your job will go live immediately after payment and remain attached to your dashboard.
                    </p>
                    <Button
                      onClick={handlePay}
                      disabled={createJob.isPending}
                      className="relative z-10 w-full h-11 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-full transition-all"
                      data-testid="button-paypal-job"
                    >
                      {createJob.isPending ? "Processing..." : "Pay $100 with PayPal"}
                    </Button>
                    <p className="relative z-10 text-[11px] text-gray-400 text-center mt-3">Sandbox mode</p>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setStep("form")} className="mt-4 rounded-full border-black/10 text-gray-700 h-10 px-5" data-testid="button-back-form">
                  Edit Job Details
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
