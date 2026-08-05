import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Check,
  Contact,
  FileText,
  Gauge,
  GraduationCap,
  Handshake,
  Layers,
  Link2,
  Lock,
  MessageSquareQuote,
  Palette,
  Rocket,
  Search,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  User,
  Wrench,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./reveal";

/* ---------------- Social proof ---------------- */

export function SocialProof({ portfolioCount }: { portfolioCount: number }) {
  const stats = [
    { value: `${Math.max(portfolioCount, 1)}+`, label: "Portfolios created" },
    { value: "500+", label: "Professionals" },
    { value: "25k+", label: "Portfolio views" },
    { value: "12", label: "Countries represented" },
  ];
  return (
    <section className="border-y border-line bg-surface/40" aria-label="Platform statistics">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <div className="font-display text-3xl text-ink md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-ink md:text-sm">{s.label}</div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-10">
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-ink">
            Trusted by people from companies, universities & organizations
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {["Startups", "Agencies", "Universities", "Nonprofits", "Studios", "Enterprises"].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-dashed border-line bg-cloud/60 py-3 text-center text-xs text-muted-ink"
              >
                {n}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Why choose ---------------- */

const WHY = [
  { icon: BadgeCheck, title: "Professional Identity", body: "Present yourself with a polished online presence people remember." },
  { icon: Link2, title: "Custom Portfolio Link", body: "Share a personalized URL anywhere — bio, résumé, email signature." },
  { icon: Palette, title: "Beautiful Templates", body: "Professionally designed layouts that look great on every device." },
  { icon: Rocket, title: "Fast Setup", body: "Build and publish your portfolio in minutes, not weekends." },
  { icon: Search, title: "Search Engine Optimized", body: "Clean metadata and structure to improve your visibility online." },
  { icon: Smartphone, title: "Responsive Design", body: "Looks perfect on desktop, tablet and mobile out of the box." },
  { icon: Lock, title: "Privacy Controls", body: "Choose exactly what information you make public." },
  { icon: Share2, title: "Easy Sharing", body: "Share across social platforms and messaging apps with rich previews." },
];

export function WhyChoose() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-6 md:py-28">
      <SectionHeading
        eyebrow="Why this platform"
        title="Everything you need to look credible online"
        subtitle="A premium portfolio experience without the design, hosting or maintenance work."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 70}>
            <div className="group h-full rounded-2xl border border-line bg-cloud/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-xl">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric transition-transform group-hover:scale-110">
                <f.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-xl text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Showcase what ---------------- */

const SHOWCASE_ITEMS = [
  { icon: User, title: "About Me", body: "A short, sharp intro to who you are." },
  { icon: Briefcase, title: "Experience", body: "Roles, timelines and what you delivered." },
  { icon: GraduationCap, title: "Education", body: "Degrees, schools and coursework." },
  { icon: Wrench, title: "Skills", body: "Tools and strengths, grouped clearly." },
  { icon: Layers, title: "Projects", body: "Full case studies with images and metrics." },
  { icon: BadgeCheck, title: "Certifications", body: "Proof of the training you've completed." },
  { icon: Award, title: "Awards", body: "Recognition that builds instant trust." },
  { icon: MessageSquareQuote, title: "Testimonials", body: "Words from clients and colleagues." },
  { icon: FileText, title: "Resume", body: "A downloadable, always-current CV." },
  { icon: Handshake, title: "Services", body: "What you offer and how to book it." },
  { icon: Share2, title: "Social Links", body: "Every profile in one tidy place." },
  { icon: Contact, title: "Contact Info", body: "A form that lands straight in your inbox." },
];

export function ShowcaseGrid() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
        <SectionHeading
          eyebrow="Your content"
          title="Everything you can showcase"
          subtitle="Turn scattered achievements into one coherent professional story."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE_ITEMS.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 70}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-cloud p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-lg">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-ink">
                  <f.icon size={16} />
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-ink">{f.title}</div>
                  <p className="mt-1 text-sm text-ink-soft">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Built for ---------------- */

const AUDIENCES = [
  "Software Developers", "Product Managers", "UI/UX Designers", "Graphic Designers",
  "Digital Marketers", "Writers", "Data Analysts", "Engineers", "Architects",
  "Researchers", "Students", "Freelancers", "Consultants", "Photographers",
  "Creators", "Agencies", "Small Businesses", "Entrepreneurs",
];

export function BuiltFor() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-6 md:py-28">
      <SectionHeading
        eyebrow="Who it's for"
        title="Built for every professional"
        subtitle="Whatever you do, your work deserves a home that looks the part."
      />
      <div className="mt-12 flex flex-wrap justify-center gap-2.5">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a} delay={(i % 6) * 50}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2.5 text-sm text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-electric/50 hover:text-ink hover:shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-electric/70" />
              {a}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */

const STEPS = [
  { n: "01", title: "Create an Account", body: "Sign up in minutes with email or Google." },
  { n: "02", title: "Build Your Portfolio", body: "Add your experience, projects, skills and achievements." },
  { n: "03", title: "Customize Your Profile", body: "Choose your layout, imagery and personal details." },
  { n: "04", title: "Share Your Link", body: "Send it to employers, clients, recruiters and collaborators." },
];

export function HowItWorks() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
        <SectionHeading eyebrow="How it works" title="Live in four simple steps" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-cloud p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="font-display text-5xl text-surface">{s.n}</span>
                <h3 className="mt-3 font-display text-xl text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-electric to-fuchsia-400 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Platform features ---------------- */

const FEATURE_GROUPS = [
  { icon: Sparkles, title: "Build Your Brand", items: ["Personal Profile", "Custom URL", "Professional Bio", "Social Links"] },
  { icon: Layers, title: "Showcase Your Work", items: ["Projects", "Experience", "Resume", "Skills", "Certifications", "Awards"] },
  { icon: Gauge, title: "Grow Opportunities", items: ["Contact Form", "Service Listings", "Testimonials", "Portfolio Analytics"] },
  { icon: Shield, title: "Professional Experience", items: ["Mobile Responsive", "Fast Performance", "SEO Optimization", "Secure Hosting", "Regular Updates"] },
];

export function PlatformFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
      <SectionHeading eyebrow="Platform" title="Features that carry real weight" />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {FEATURE_GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={(i % 2) * 90}>
            <div className="h-full rounded-2xl border border-line bg-gradient-to-br from-cloud to-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-xl md:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-cloud">
                <g.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-2xl text-ink">{g.title}</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-ink-soft">
                    <Check size={14} className="shrink-0 text-electric" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

const TESTIMONIALS = [
  { name: "Amara Okafor", role: "Product Designer", rating: 5, quote: "I replaced three links in my résumé with one portfolio URL. Recruiters actually reply now." },
  { name: "Daniel Mensah", role: "Software Engineer", rating: 5, quote: "Setup took an evening. The case study layout made my side projects look like real product work." },
  { name: "Sofia Marchetti", role: "Growth Marketer", rating: 5, quote: "Clean, fast and genuinely premium. Clients comment on it before we even get to the pitch." },
];

export function Testimonials() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
        <SectionHeading eyebrow="Testimonials" title="Loved by people who ship" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric/10 font-display text-base text-electric">
                    {t.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{t.name}</span>
                    <span className="block truncate text-xs text-muted-ink">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "forever",
    features: ["Custom /u/username link", "Projects & blog", "Contact form", "Mobile responsive", "SEO basics"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    note: "per month",
    features: ["Everything in Free", "Case studies & galleries", "Testimonials & services", "Portfolio analytics", "Priority support"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$19",
    note: "per month",
    features: ["Everything in Pro", "Custom domain", "Advanced SEO controls", "Remove platform badge", "Early access features"],
    cta: "Get Premium",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-6 md:py-28">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple plans that grow with you"
        subtitle="Start free. Upgrade only when your portfolio starts working for you."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 90}>
            <div
              className={`relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                p.highlight ? "border-electric/50 bg-ink text-cloud shadow-xl" : "border-line bg-cloud"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-electric px-3 py-1 text-[11px] font-medium text-cloud">
                  Recommended
                </span>
              )}
              <div className={`font-display text-2xl ${p.highlight ? "text-cloud" : "text-ink"}`}>{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className={`font-display text-4xl ${p.highlight ? "text-cloud" : "text-ink"}`}>{p.price}</span>
                <span className={`text-xs ${p.highlight ? "text-cloud/60" : "text-muted-ink"}`}>{p.note}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${p.highlight ? "text-cloud/80" : "text-ink-soft"}`}>
                    <Check size={14} className={`mt-0.5 shrink-0 ${p.highlight ? "text-electric" : "text-electric"}`} /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] ${
                  p.highlight ? "bg-electric text-cloud" : "bg-ink text-cloud"
                }`}
              >
                {p.cta} <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  { q: "Is the platform free?", a: "Yes. The Free plan gives you a full portfolio with your own /u/username link, projects, blog and a contact form. Paid plans add case studies, analytics and a custom domain." },
  { q: "Can I use my own domain?", a: "Custom domains are available on the Premium plan. On Free and Pro you get a clean, shareable link on the platform." },
  { q: "Can I update my portfolio anytime?", a: "Always. Your dashboard lets you edit any section and publish changes instantly." },
  { q: "Is my portfolio mobile friendly?", a: "Every layout is mobile-first and tested on phones, tablets and desktops." },
  { q: "Can employers contact me directly?", a: "Yes — the built-in contact form sends messages straight to your inbox, and you'll see them in your dashboard." },
  { q: "Can I hide sections of my portfolio?", a: "Yes. Every section can be shown or hidden, and your whole portfolio can stay unpublished until you're ready." },
  { q: "Will my portfolio appear in search engines?", a: "Published portfolios ship with proper titles, descriptions, Open Graph tags and structured data so search engines can index them." },
];

export function FAQ() {
  return (
    <section id="faq" className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 md:px-6 md:py-28">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Reveal delay={100} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-line">
                <AccordionTrigger className="text-left text-base text-ink hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-ink-soft">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

export function FinalCTA({ demoUsername }: { demoUsername?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-ink p-10 text-cloud md:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-electric/30 blur-3xl animate-blob" />
            <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob animation-delay-2000" />
          </div>
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              Start Building Your Professional Presence Today
            </h2>
            <p className="mt-4 text-cloud/70 md:text-lg">
              Join professionals using one powerful portfolio to showcase their work, build credibility,
              and create new opportunities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-medium text-cloud transition-transform hover:scale-[1.03]"
              >
                Create Free Portfolio <ArrowUpRight size={14} />
              </Link>
              {demoUsername ? (
                <Link
                  to="/u/$username"
                  params={{ username: demoUsername }}
                  className="inline-flex items-center gap-2 rounded-full border border-cloud/25 px-6 py-3 text-sm font-medium text-cloud transition-colors hover:bg-cloud/10"
                >
                  Explore Demo
                </Link>
              ) : (
                <a
                  href="#showcase"
                  className="inline-flex items-center gap-2 rounded-full border border-cloud/25 px-6 py-3 text-sm font-medium text-cloud transition-colors hover:bg-cloud/10"
                >
                  Explore Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}