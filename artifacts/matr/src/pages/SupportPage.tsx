import { useEffect, useState } from "react";
import { Headphones, LifeBuoy, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trustFaqs } from "@/lib/trust-content";

type SupportMeta = {
  email: string;
  officeHours: string;
  responsePromise: string;
  topics: Array<{ value: string; label: string; responseWindow: string }>;
};

export default function SupportPage() {
  const [meta, setMeta] = useState<SupportMeta | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", organization: "", topic: "", message: "" });

  useEffect(() => {
    void fetch("/api/support/meta")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load support information.");
        return response.json() as Promise<SupportMeta>;
      })
      .then((data) => {
        setMeta(data);
        setForm((current) => ({ ...current, topic: current.topic || data.topics[0]?.value || "" }));
      })
      .catch(() => {
        setError("Support details are temporarily unavailable. You can still use the form below.");
      });
  }, []);

  const submit = async () => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to submit your request.");
      setResult(payload.message ?? "Your request has been received.");
      setForm((current) => ({ ...current, organization: "", message: "" }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">

      {/* ── HERO ── */}
      <div className="bg-[#080808] text-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto grid gap-10 px-5 sm:px-8 lg:px-10 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#E50914] font-bold">Support</p>
            <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
              Real product support for members, employers, and advertisers.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55">
              Get help with profiles, memberships, job postings, advertising, and account access without guessing where to go next.
            </p>
          </div>

          {/* Info tiles */}
          <div
            className="rounded-[2rem] p-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset",
            }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { icon: Headphones, label: "Support inbox", value: meta?.email ?? "support@matr.local" },
                { icon: ShieldCheck, label: "Response goal", value: meta?.responsePromise ?? "Most requests receive a response within 1 business day." },
                { icon: Mail, label: "Office hours", value: meta?.officeHours ?? "Monday to Friday, 9:00 AM to 5:00 PM Eastern" },
                { icon: LifeBuoy, label: "Coverage", value: "Accounts, billing, profiles, jobs, ads, and technical help" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(0,0,0,0.28)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <item.icon size={16} className="mb-3 text-[#E50914]" />
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">{item.label}</p>
                  <p className="mt-2 text-[13px] font-semibold text-white leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FORM + FAQ ── */}
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:px-10 lg:grid-cols-[1fr_.9fr] lg:py-12">

        {/* Contact form */}
        <div className="matr-premium-card p-7 md:p-9">
          <p className="relative z-10 mb-2 text-[10px] uppercase tracking-[0.24em] text-gray-400 font-semibold">Contact Support</p>
          <h2 className="relative z-10 text-2xl font-black text-[#0a0a0a] mb-1">Send a request</h2>
          <p className="relative z-10 mb-6 text-[13px] text-gray-500">
            Use this form for account help, membership questions, job posting issues, advertising, or technical problems.
          </p>

          <div className="relative z-10 grid gap-3 md:grid-cols-2 mb-3">
            <Input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              className="rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]"
            />
            <Input
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              className="rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]"
            />
            <Input
              placeholder="Organization (optional)"
              value={form.organization}
              onChange={(e) => setForm((current) => ({ ...current, organization: e.target.value }))}
              className="rounded-xl border-black/8 bg-[#f7f6f2] text-[14px]"
            />
            <select
              value={form.topic}
              onChange={(e) => setForm((current) => ({ ...current, topic: e.target.value }))}
              className="h-10 rounded-xl border border-black/8 bg-[#f7f6f2] px-3 text-[14px] text-gray-700"
            >
              {(meta?.topics ?? []).map((topic) => (
                <option key={topic.value} value={topic.value}>{topic.label}</option>
              ))}
            </select>
          </div>

          <div className="relative z-10">
            <Textarea
              className="min-h-36 rounded-2xl border-black/8 bg-[#f7f6f2] text-[14px]"
              placeholder="Tell MATR support what you need help with."
              value={form.message}
              onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))}
            />
          </div>

          {error && <p className="relative z-10 mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700 border border-red-100">{error}</p>}
          {result && <p className="relative z-10 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700 border border-emerald-100">{result}</p>}

          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
            <Button
              className="rounded-full bg-[#E50914] text-white hover:bg-[#c8060f] h-10 px-6 font-bold shadow-[0_4px_16px_rgba(229,9,20,0.28)] transition-all"
              onClick={submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit Request"}
            </Button>
            <p className="text-[12px] text-gray-400">Most requests receive a reply within 1 business day.</p>
          </div>
        </div>

        {/* FAQ + trust */}
        <div className="space-y-4">
          <div className="matr-premium-card p-6 md:p-8">
            <div className="relative z-10 mb-5 flex items-center gap-3">
              <MessageSquare size={16} className="text-[#E50914]" />
              <h2 className="text-2xl font-black text-[#0a0a0a]">Help Center</h2>
            </div>
            <Accordion type="single" collapsible className="w-full relative z-10">
              {trustFaqs.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="text-[15px] font-semibold text-[#0a0a0a] hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-relaxed text-gray-500">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="matr-dark-panel p-6 md:p-8">
            <p className="relative z-10 mb-2 text-[10px] uppercase tracking-[0.24em] text-white/36 font-bold">Trust</p>
            <h3 className="relative z-10 text-xl font-black text-white mb-3">A finished product needs clarity.</h3>
            <p className="relative z-10 text-[13px] leading-relaxed text-white/58">
              MATR now has direct support entry points, published privacy and terms pages, and a backend-backed help workflow so members are never left guessing how to get help.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
