import { ArrowUpRight, Clock, MapPin, Timer, Star } from "lucide-react";
import { Section } from "@/components/portfolio/sections";
import { Reveal } from "@/components/landing/reveal";
import { openContactDialog } from "@/lib/contact-dialog-store";
import {
  actionLabel,
  categoryLabel,
  priceSummary,
  LOCATION_LABEL,
  type ServiceRow,
} from "@/lib/services-config";

export function ServicesSection({ services }: { services: ServiceRow[] }) {
  const visible = services.filter((s) => s.status === "active");
  if (visible.length === 0) return null;

  return (
    <Section
      id="services"
      eyebrow="Services"
      title="How we can work together"
      description="Pick the engagement that fits — every request goes straight to the inbox."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 60}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cloud transition-shadow hover:shadow-lg"
          >
            {s.cover_image_url && (
              <img src={s.cover_image_url} alt={s.name} className="aspect-[16/9] w-full object-cover" loading="lazy" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-ink">
                  {categoryLabel(s.category)}
                </span>
                {s.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-electric/10 px-2.5 py-1 text-[11px] font-medium text-electric">
                    <Star size={11} /> Featured
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-2xl leading-tight text-ink">{s.name}</h3>
              {s.short_description && <p className="mt-2 text-sm text-ink-soft">{s.short_description}</p>}
              {s.detailed_description && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-ink">
                  {s.detailed_description}
                </p>
              )}

              <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-ink">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} /> {LOCATION_LABEL[s.location] ?? s.location}
                </span>
                {s.duration && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} /> {s.duration}
                  </span>
                )}
                {s.delivery_time && (
                  <span className="inline-flex items-center gap-1.5">
                    <Timer size={12} /> {s.delivery_time}
                  </span>
                )}
              </dl>
              {s.availability && <p className="mt-2 text-xs text-muted-ink">{s.availability}</p>}

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="font-display text-lg text-ink">{priceSummary(s)}</span>
                {s.accepting_requests ? (
                  <button
                    type="button"
                    onClick={() => openContactDialog(s.id)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-cloud transition-transform hover:scale-[1.03]"
                  >
                    {actionLabel(s)} <ArrowUpRight size={13} />
                  </button>
                ) : (
                  <span className="rounded-full border border-line px-4 py-2 text-xs text-muted-ink">
                    Not accepting requests
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}