import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About — Ayo Richard Abe" },
      { name: "description", content: "Product Manager, Developer, Growth Marketer. Bridging engineering complexity and user desire." },
      { property: "og:title", content: "About — Ayo Richard Abe" },
      { property: "og:description", content: "Product Manager, Developer, Growth Marketer." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <article className="prose-editorial max-w-3xl space-y-8">
      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">About</div>
        <h1 className="mt-3 font-display text-5xl leading-tight text-ink">Builder, operator, market-maker.</h1>
      </header>
      <p className="text-lg leading-relaxed text-ink-soft">
        I'm Ayo Richard Abe — a Product Manager, Product Developer, and Growth Marketer with a decade
        of experience translating engineering complexity into category-defining products.
      </p>
      <p className="text-base leading-relaxed text-ink-soft">
        My work sits at the intersection of fintech, logistics, and AI tooling. I have shipped products
        used by millions across emerging markets, led 0-to-1 launches that became category leaders,
        and built the growth systems that sustained them.
      </p>

      <section>
        <h2 className="font-display text-2xl text-ink">What I do</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {["Product strategy & roadmapping", "Full-stack prototyping", "Growth experimentation", "Pricing & monetization", "Team building", "Go-to-market"].map((s) => (
            <li key={s} className="rounded-lg border border-line bg-cloud px-4 py-3 text-sm text-ink">{s}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}