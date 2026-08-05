import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { listFeaturedPortfolios } from "@/lib/cms/public.functions";
import { supabase } from "@/integrations/supabase/client";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import {
  SocialProof,
  WhyChoose,
  ShowcaseGrid,
  BuiltFor,
  HowItWorks,
  PlatformFeatures,
  Testimonials,
  Pricing,
  FAQ,
  FinalCTA,
} from "@/components/landing/sections";
import { PortfolioShowcase } from "@/components/landing/portfolio-showcase";
import { LandingFooter } from "@/components/landing/landing-footer";

const featuredQO = queryOptions({
  queryKey: ["platform", "featured-portfolios"],
  queryFn: () => listFeaturedPortfolios(),
  staleTime: 60_000,
});

const TITLE = "Portfolio Platform — Build a Professional Portfolio";
const DESCRIPTION =
  "Create a beautiful, personalized portfolio that showcases your skills, experience, projects and achievements — all from a single shareable link.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://portfolio-platform.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://portfolio-platform.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Portfolio Platform",
          url: "https://portfolio-platform.lovable.app/",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQO),
  component: Landing,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function Landing() {
  const { data: featured } = useSuspenseQuery(featuredQO);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const demoUsername = featured[0]?.username;

  return (
    <div className="min-h-screen bg-cloud text-ink">
      <LandingNav signedIn={signedIn} />
      <main>
        <Hero demoUsername={demoUsername} />
        <SocialProof portfolioCount={featured.length} />
        <WhyChoose />
        <ShowcaseGrid />
        <BuiltFor />
        <PortfolioShowcase featured={featured} />
        <HowItWorks />
        <PlatformFeatures />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA demoUsername={demoUsername} />
      </main>
      <LandingFooter />
    </div>
  );
}
