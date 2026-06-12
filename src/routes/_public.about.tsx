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
        <h1 className="mt-3 font-display text-5xl leading-tight text-ink">Product Manager, Developer & Growth Marketer.</h1>
      </header>
      <p className="text-lg leading-relaxed text-ink-soft">
        Hello, I'm Ayo Richard Abe — a Product Manager, Product Developer, and Growth Marketer passionate about building products that solve real-world problems.
      </p>
      <p className="text-base leading-relaxed text-ink-soft">
        My background spans Product Management, Product Development, Marketing, and Growth Strategy. I enjoy working at the intersection of business, technology, and user needs, helping teams transform ideas into products that create value.
      </p>
      <p className="text-base leading-relaxed text-ink-soft">
        I have experience contributing to both product and marketing initiatives, allowing me to understand not only how products are built but also how they are positioned, acquired, and adopted by users.
      </p>
      <p className="text-base leading-relaxed text-ink-soft">
        My approach combines strategic thinking, execution, user research, stakeholder management, and continuous learning. Whether I'm defining product requirements, conducting market research, creating growth strategies, or collaborating with cross-functional teams, I focus on delivering meaningful outcomes.
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