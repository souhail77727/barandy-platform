import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { auth } from "@/auth";
import ClientHeader from "@/components/layout/ClientHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BrandDNA = {
  personName?: string;

  voice?: {
    tone?: string[] | string;
    style?: string[] | string;
  };

  values?: string[] | string;

  vision?: string;
  purpose?: string;

  ikigai?: {
    mission?: string;
    passion?: string;
    vocation?: string;
    profession?: string;
    intersection?: string;
  };

  perception?: {
    specialistVsPolymath?: number;
    innovationVsTradition?: number;
    provocativeVsReassuring?: number;
    authorityVsAccessibility?: number;
  };

  primaryArchetype?: {
    id?: string;
    name?: string;
    icon?: string;
    motto?: string;
    shadow?: string;
    dominance?: number;
  };

  secondaryArchetype?: {
    id?: string;
    name?: string;
    icon?: string;
    motto?: string;
    shadow?: string;
    dominance?: number;
  };

  colorPalette?: {
    accent?: string;
    primary?: string;
    secondary?: string;
    darkNeutral?: string;
    lightNeutral?: string;
  };

  elevatorPitch?: string;

  executivePositioning?: string;

  strategicManifesto?: string;

  strategicAdvices?: string[];

  contentPillars?: Array<
    | string
    | {
        title?: string;
        description?: string;
      }
  >;
};

function toArray(value?: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function formatLabel(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInterpretation(value: number): string {
  const distance = Math.abs(value - 50);
  if (value === 50) return "Balanced";
  if (distance >= 35) return "Clear tendency";
  if (distance >= 15) return "Leaning";
  return "Slight preference";
}

export default async function ResultsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      firstName: true,
      accessGranted: true,

      assessments: {
        where: {
          status: "COMPLETED",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          result: {
            select: {
              brandDNA: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const assessment = user.assessments[0];

  if (!assessment?.result) {
    redirect("/assessment");
  }

  const brandDNA = assessment.result.brandDNA as BrandDNA;

  /*
   * =========================================================
   * ACCESS PROTECTION — premium locked state
   * =========================================================
   */

  if (!user.accessGranted) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="results"
          showBack
        />

        <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden border border-black/10 bg-white">
              {/* --------------------------------------------------
                  LOCKED HERO
              -------------------------------------------------- */}
              <div className="relative overflow-hidden px-7 py-14 md:px-14 md:py-20">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-black/5"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-black/5"
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171519] text-xs text-white"
                      aria-hidden="true"
                    >
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>

                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
                      Brand DNA
                    </p>
                  </div>

                  <h1 className="mt-8 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-5xl md:text-7xl">
                    Your brand has already
                    <span className="text-black/30"> been decoded.</span>
                  </h1>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-black/55 md:text-lg">
                    Your assessment has been analyzed and your personalized
                    Brand DNA is waiting for you.
                  </p>

                  <div className="mt-12 grid gap-3 sm:grid-cols-3">
                    <UnlockStep number="01" label="Assessment" complete />
                    <UnlockStep number="02" label="Analysis" complete />
                    <UnlockStep number="03" label="Your Brand DNA" />
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------
                  PAYWALL CTA
              -------------------------------------------------- */}
              <div className="border-t border-black/10 bg-[#171519] px-7 py-10 text-white md:px-14 md:py-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  One final step
                </p>

                <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
                  Unlock the profile built around you.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                  Complete your payment verification to explore your
                  archetypes, positioning, voice, values, visual direction and
                  strategic recommendations.
                </p>

                <Link
                  href="/payment"
                  className="group mt-8 inline-flex min-h-[52px] items-center gap-3 bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#171519] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_12px_30px_rgba(255,255,255,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Unlock my Brand DNA
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.8}
                  />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * =========================================================
   * NORMALIZED DATA
   * =========================================================
   */

  const personName =
    brandDNA.personName?.trim() ||
    user.firstName?.trim() ||
    "Your";

  const voiceTone = toArray(brandDNA.voice?.tone);
  const voiceStyle = toArray(brandDNA.voice?.style);
  const values = toArray(brandDNA.values);

  const primaryArchetype =
    brandDNA.primaryArchetype?.name ||
    formatLabel(brandDNA.primaryArchetype?.id) ||
    "Primary Archetype";

  const secondaryArchetype =
    brandDNA.secondaryArchetype?.name ||
    formatLabel(brandDNA.secondaryArchetype?.id) ||
    "Secondary Archetype";

  const hasArchetypes = Boolean(
    brandDNA.primaryArchetype || brandDNA.secondaryArchetype
  );
  const hasVoice = voiceTone.length > 0 || voiceStyle.length > 0;
  const hasValues = values.length > 0;
  const hasIkigai = Boolean(brandDNA.ikigai);
  const hasPositioning = Boolean(brandDNA.executivePositioning);
  const hasPerception = Boolean(brandDNA.perception);
  const hasPurposeOrVision = Boolean(brandDNA.purpose || brandDNA.vision);
  const hasColorPalette = Boolean(brandDNA.colorPalette);
  const hasContentPillars = Boolean(
    brandDNA.contentPillars && brandDNA.contentPillars.length > 0
  );
  const hasAdvices = Boolean(
    brandDNA.strategicAdvices && brandDNA.strategicAdvices.length > 0
  );
  const hasManifesto = Boolean(brandDNA.strategicManifesto);

  const totalSections = [
    hasArchetypes,
    hasVoice,
    hasValues,
    hasIkigai,
    hasPositioning,
    hasPerception,
    hasPurposeOrVision,
    hasColorPalette,
    hasContentPillars,
    hasAdvices,
  ].filter(Boolean).length;

  /* Sequential numbering — only counts what's actually rendered */
  let sectionIndex = 0;
  const nextNumber = () =>
    String(++sectionIndex).padStart(2, "0");

  const archetypeNumber = hasArchetypes ? nextNumber() : "";
  const voiceNumber = hasVoice ? nextNumber() : "";
  const valuesNumber = hasValues ? nextNumber() : "";
  const ikigaiNumber = hasIkigai ? nextNumber() : "";
  const positioningNumber = hasPositioning ? nextNumber() : "";
  const perceptionNumber = hasPerception ? nextNumber() : "";
  const directionNumber = hasPurposeOrVision ? nextNumber() : "";
  const visualNumber = hasColorPalette ? nextNumber() : "";
  const contentNumber = hasContentPillars ? nextNumber() : "";
  const strategyNumber = hasAdvices ? nextNumber() : "";
  const manifestoNumber = hasManifesto
    ? String(sectionIndex + 1).padStart(2, "0")
    : "";

  /*
   * =========================================================
   * MAIN RENDER
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      {/* Global CSS for smooth scroll and reading progress */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            @media (prefers-reduced-motion: reduce) {
              html { scroll-behavior: auto; }
            }
            @keyframes readingProgress {
              from { transform: scaleX(0); }
              to   { transform: scaleX(1); }
            }
            .reading-progress-bar {
              animation: readingProgress linear;
              animation-timeline: scroll(root);
              transform-origin: left;
            }
          `,
        }}
      />

      {/* Reading progress bar (CSS scroll-driven, graceful fallback) */}
      <div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-transparent"
        aria-hidden="true"
      >
        <div className="reading-progress-bar h-full w-full bg-[#8B7653]" />
      </div>

      <ClientHeader
        firstName={user.firstName}
        currentPage="results"
        showBack
      />

      {/* =====================================================
          STICKY EXPLORATION NAV
      ===================================================== */}
      <div className="sticky top-0 z-30 border-b border-black/10 bg-[#F8F5F1]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3 sm:px-6 md:px-10">
          <div className="flex shrink-0 items-center gap-3">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171519] text-white"
              aria-hidden="true"
            >
              <Sparkles className="h-3 w-3" strokeWidth={1.8} />
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
              Brand DNA
            </span>
          </div>

          <nav
            aria-label="Section navigation"
            className="hidden items-center gap-6 lg:flex"
          >
            {hasArchetypes && <NavAnchor href="#archetypes" label="Archetypes" />}
            {hasVoice && <NavAnchor href="#voice" label="Voice" />}
            {hasValues && <NavAnchor href="#values" label="Values" />}
            {hasIkigai && <NavAnchor href="#purpose" label="Purpose" />}
            {hasPositioning && (
              <NavAnchor href="#positioning" label="Positioning" />
            )}
            {hasAdvices && <NavAnchor href="#strategy" label="Strategy" />}
          </nav>

          <span className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/45">
            {totalSections} discoveries
          </span>
        </div>

        {/* Mobile: horizontally scrollable nav */}
        <nav
          aria-label="Section navigation"
          className="flex gap-5 overflow-x-auto border-t border-black/[0.06] px-5 pb-2.5 pt-2 sm:px-6 md:px-10 lg:hidden"
        >
          {hasArchetypes && <NavAnchor href="#archetypes" label="Archetypes" />}
          {hasVoice && <NavAnchor href="#voice" label="Voice" />}
          {hasValues && <NavAnchor href="#values" label="Values" />}
          {hasIkigai && <NavAnchor href="#purpose" label="Purpose" />}
          {hasPositioning && (
            <NavAnchor href="#positioning" label="Positioning" />
          )}
          {hasAdvices && <NavAnchor href="#strategy" label="Strategy" />}
        </nav>
      </div>

      <main className="mx-auto max-w-6xl px-5 sm:px-6 md:px-10">
        {/* =====================================================
            HERO / IDENTITY
        ===================================================== */}
        <section
          id="identity"
          className="relative scroll-mt-24 overflow-hidden border-b border-black/10 py-16 md:py-24"
        >
          <div
            className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full border border-black/[0.04]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-20 top-[5.5rem] h-56 w-56 rounded-full border border-black/[0.04]"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                aria-hidden="true"
              >
                <Sparkles
                  className="h-4 w-4 text-[#8B7653]"
                  strokeWidth={1.6}
                />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
                  Your personal brand
                </p>

                <p className="mt-1 text-xs text-black/40">
                  The moment of truth.
                </p>
              </div>
            </div>

            <h1 className="mt-10 max-w-5xl text-[3.25rem] font-medium leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-8xl">
              <span className="font-serif font-normal italic text-[#8B7653]">
                {personName}
              </span>
              <br />
              <span className="text-black/25">decoded.</span>
            </h1>

            {brandDNA.elevatorPitch && (
              <div className="mt-14 max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
                  Your brand in one sentence
                </p>

                <p className="mt-5 text-xl leading-8 tracking-[-0.02em] text-black/70 md:text-[1.6rem] md:leading-[2.6rem]">
                  {brandDNA.elevatorPitch}
                </p>
              </div>
            )}

            <div className="mt-14 grid gap-3 md:grid-cols-3">
              <IdentityCard
                number="01"
                label="Primary energy"
                value={primaryArchetype}
              />

              <IdentityCard
                number="02"
                label="Supporting energy"
                value={secondaryArchetype}
              />

              <IdentityCard
                number="03"
                label="Brand state"
                value="Defined"
              />
            </div>

            <div className="mt-12 flex items-center gap-3 text-xs text-black/35">
              <span className="h-px w-8 bg-black/20" aria-hidden="true" />
              <span>Keep exploring — there is more to discover below.</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            ARCHETYPES
        ===================================================== */}
        {hasArchetypes && (
          <section
            id="archetypes"
            className="scroll-mt-24 border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number={archetypeNumber}
              eyebrow="The personality layer"
              title="Meet the personality behind your brand."
              description="Your archetypes reveal the energy people are most likely to feel when they experience your personal brand."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              <ArchetypeCard
                label="Your dominant archetype"
                archetype={brandDNA.primaryArchetype}
                featured
              />

              <ArchetypeCard
                label="Your supporting archetype"
                archetype={brandDNA.secondaryArchetype}
              />
            </div>
          </section>
        )}

        {/* =====================================================
            VOICE
        ===================================================== */}
        {hasVoice && (
          <section
            id="voice"
            className="scroll-mt-24 border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number={voiceNumber}
              eyebrow="The communication layer"
              title="Now, hear what your brand sounds like."
              description="Your voice is not just what you say. It is how people feel when they hear you."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {voiceTone.length > 0 && (
                <VoiceCard
                  label="Your tone"
                  title="How you should sound."
                  description="The emotional character behind your communication."
                  items={voiceTone}
                />
              )}

              {voiceStyle.length > 0 && (
                <VoiceCard
                  label="Your style"
                  title="How your ideas come across."
                  description="The way your thinking naturally shows up."
                  items={voiceStyle}
                />
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            VALUES
        ===================================================== */}
        {hasValues && (
          <section
            id="values"
            className="scroll-mt-24 border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number={valuesNumber}
              eyebrow="The values layer"
              title="These are the things you don't want to compromise on."
              description="Your values become your internal compass — the principles that shape how you decide, create and lead."
            />

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => (
                <ValueCard
                  key={`${value}-${index}`}
                  value={value}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            IKIGAI
        ===================================================== */}
        {brandDNA.ikigai && (
          <section
            id="purpose"
            className="scroll-mt-24 border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number={ikigaiNumber}
              eyebrow="The purpose layer"
              title="And here is what makes it meaningful."
              description="Your Ikigai connects what you love, what you are good at, what the world needs and what you can build value around."
            />

            <div className="mt-14 grid gap-3 md:grid-cols-2">
              <IkigaiCard
                number="01"
                label="Mission"
                value={brandDNA.ikigai.mission}
              />

              <IkigaiCard
                number="02"
                label="Passion"
                value={brandDNA.ikigai.passion}
              />

              <IkigaiCard
                number="03"
                label="Vocation"
                value={brandDNA.ikigai.vocation}
              />

              <IkigaiCard
                number="04"
                label="Profession"
                value={brandDNA.ikigai.profession}
              />
            </div>

            {brandDNA.ikigai.intersection && (
              <div className="relative mt-3 overflow-hidden bg-[#171519] px-7 py-12 text-white md:px-14 md:py-16">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-white/10"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/[0.06]"
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171519]"
                      aria-hidden="true"
                    >
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                      The intersection
                    </p>
                  </div>

                  <p className="mt-8 max-w-4xl text-2xl font-medium leading-9 tracking-[-0.025em] md:text-4xl md:leading-[1.3]">
                    {brandDNA.ikigai.intersection}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            POSITIONING
        ===================================================== */}
        {brandDNA.executivePositioning && (
          <section
            id="positioning"
            className="scroll-mt-24 border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number={positioningNumber}
              eyebrow="The positioning layer"
              title="This is how the world should remember you."
              description="Your positioning turns everything we discovered into a clear space you can own."
            />

            <div className="relative mt-14 overflow-hidden border border-black/10 bg-white px-7 py-12 md:px-14 md:py-16">
              <div
                className="absolute left-0 top-0 h-1 w-full bg-[#171519]"
                aria-hidden="true"
              />

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
                Your positioning statement
              </p>

              <p className="mt-8 max-w-4xl text-2xl font-medium leading-[1.35] tracking-[-0.03em] md:text-[2.6rem] md:leading-[1.25]">
                {brandDNA.executivePositioning}
              </p>

              <div className="mt-12 flex items-center gap-3 text-xs text-black/40">
                <span className="h-px w-8 bg-black/20" aria-hidden="true" />
                <span>This is the space your brand can own.</span>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            PERCEPTION
        ===================================================== */}
        {brandDNA.perception && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionHeader
              number={perceptionNumber}
              eyebrow="The perception layer"
              title="Your brand has a certain gravity."
              description="These dimensions show where your personal brand naturally sits between different strategic extremes."
            />

            <div className="mt-14 border border-black/10 bg-white p-7 md:p-14">
              <div className="space-y-14">
                <PerceptionBar
                  left="Specialist"
                  right="Polymath"
                  value={brandDNA.perception.specialistVsPolymath}
                />

                <PerceptionBar
                  left="Innovation"
                  right="Tradition"
                  value={brandDNA.perception.innovationVsTradition}
                />

                <PerceptionBar
                  left="Provocative"
                  right="Reassuring"
                  value={brandDNA.perception.provocativeVsReassuring}
                />

                <PerceptionBar
                  left="Authority"
                  right="Accessibility"
                  value={brandDNA.perception.authorityVsAccessibility}
                />
              </div>

              <div className="mt-12 border-t border-black/10 pt-7">
                <p className="text-xs leading-5 text-black/40">
                  Think of these as your brand's natural tendencies — not
                  limitations.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            PURPOSE + VISION
        ===================================================== */}
        {hasPurposeOrVision && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionHeader
              number={directionNumber}
              eyebrow="The direction layer"
              title="You know who you are. Now, where are you going?"
              description="Purpose gives your brand meaning. Vision gives it direction."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {brandDNA.purpose && (
                <DirectionCard
                  label="Purpose"
                  title="Why you exist."
                  value={brandDNA.purpose}
                />
              )}

              {brandDNA.vision && (
                <DirectionCard
                  label="Vision"
                  title="Where you're going."
                  value={brandDNA.vision}
                />
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            VISUAL IDENTITY
        ===================================================== */}
        {brandDNA.colorPalette && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionHeader
              number={visualNumber}
              eyebrow="The visual layer"
              title="If your brand had a visual mood."
              description="This palette gives you a starting point for expressing your personality visually."
            />

            <div className="mt-14 overflow-hidden border border-black/10 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-5">
                <ColorSwatch
                  label="Accent"
                  value={brandDNA.colorPalette.accent}
                />

                <ColorSwatch
                  label="Primary"
                  value={brandDNA.colorPalette.primary}
                />

                <ColorSwatch
                  label="Secondary"
                  value={brandDNA.colorPalette.secondary}
                />

                <ColorSwatch
                  label="Dark Neutral"
                  value={brandDNA.colorPalette.darkNeutral}
                />

                <ColorSwatch
                  label="Light Neutral"
                  value={brandDNA.colorPalette.lightNeutral}
                />
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            CONTENT PILLARS
        ===================================================== */}
        {hasContentPillars && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionHeader
              number={contentNumber}
              eyebrow="The content layer"
              title="Here is what your brand should talk about."
              description="These content territories help you stay recognizable while giving your audience something valuable to follow."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {brandDNA.contentPillars!.map((pillar, index) => {
                if (typeof pillar === "string") {
                  return (
                    <ContentCard
                      key={`pillar-${index}`}
                      number={index + 1}
                      title={pillar}
                    />
                  );
                }

                return (
                  <ContentCard
                    key={`pillar-${index}`}
                    number={index + 1}
                    title={pillar.title || "Content Pillar"}
                    description={pillar.description}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            STRATEGY
        ===================================================== */}
        {hasAdvices && (
          <section
            id="strategy"
            className="scroll-mt-24 border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number={strategyNumber}
              eyebrow="The action layer"
              title="Enough discovering. Now let's use it."
              description="These are the practical moves that can turn your Brand DNA into visible action."
            />

            <div className="mt-14 space-y-3">
              {brandDNA.strategicAdvices!.map((advice, index) => (
                <AdviceCard
                  key={`advice-${index}`}
                  number={index + 1}
                  advice={advice}
                />
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            MANIFESTO
        ===================================================== */}
        {brandDNA.strategicManifesto && (
          <section className="py-16 md:py-28">
            <div className="relative overflow-hidden bg-[#171519] px-7 py-14 text-white md:px-14 md:py-24">
              <div
                className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full border border-white/[0.06]"
                aria-hidden="true"
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#171519]"
                    aria-hidden="true"
                  >
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </span>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    {manifestoNumber} · Your manifesto
                  </p>
                </div>

                <h2 className="mt-10 max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.04em] md:text-6xl">
                  If your brand could speak,
                  <br />
                  <span className="text-white/30">
                    this is what it would say.
                  </span>
                </h2>

                <div className="mt-14 max-w-3xl">
                  <p className="whitespace-pre-line text-lg leading-8 text-white/70 md:text-xl md:leading-9">
                    {brandDNA.strategicManifesto}
                  </p>
                </div>

                <div className="mt-14 border-t border-white/10 pt-7">
                  <p className="text-xs text-white/40">
                    Your Brand DNA is not a label. It is a direction.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            CLOSING / NEXT STEPS
        ===================================================== */}
        <section className="border-t border-black/10 py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
              What's next
            </p>

            <h2 className="mt-4 text-3xl font-medium leading-[1.05] tracking-[-0.04em] md:text-4xl">
              You have the map.{" "}
              <span className="text-black/30">Now, walk it.</span>
            </h2>

            <p className="mt-5 text-sm leading-6 text-black/50 md:text-base">
              Your Brand DNA is a living document. Revisit it, apply it, and
              let it evolve as your work does.
            </p>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            <NextStepCard
              number="01"
              title="Return to your dashboard"
              description="See your progress and pick up where you left off."
              href="/dashboard"
            />

            <NextStepCard
              number="02"
              title="Review your answers"
              description="Revisit the assessment that shaped this profile."
              href="/assessment"
            />

            <NextStepCard
              number="03"
              title="Start again from scratch"
              description="As you grow, your Brand DNA can grow with you."
              href="/assessment"
            />
          </div>

          <div className="mt-14 flex flex-col gap-8 border-t border-black/10 pt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171519] text-white"
                  aria-hidden="true"
                >
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                </span>

                <p className="text-sm font-semibold tracking-[0.25em]">
                  BARANDY
                </p>
              </div>

              <p className="mt-4 text-xs text-black/40">
                Personal Brand Intelligence
              </p>
            </div>

            <div className="max-w-md md:text-right">
              <p className="text-sm leading-6 text-black/50">
                You now have a clearer picture of who you are, how you
                communicate and where your brand can go.
              </p>

              <p className="mt-3 text-xs text-black/35">
                The next step is turning insight into action.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/*
 * =========================================================
 * PRESENTATIONAL COMPONENTS
 * =========================================================
 */

function NavAnchor({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 transition-colors duration-200 hover:text-[#171519] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
    >
      {label}
    </Link>
  );
}

function SectionHeader({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[10px] font-semibold tabular-nums"
          aria-hidden="true"
        >
          {number}
        </span>

        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-7 text-3xl font-medium leading-[1.05] tracking-[-0.045em] md:text-5xl">
        {title}
      </h2>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-black/55 md:text-base md:leading-8">
        {description}
      </p>
    </div>
  );
}

function IdentityCard({
  number,
  label,
  value,
}: {
  number: string;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_12px_30px_rgba(23,21,25,0.06)] md:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
          {number}
        </span>

        <ArrowUpRight
          className="h-3.5 w-3.5 text-black/20 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black/50"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
        {label}
      </p>

      <p className="mt-3 text-xl font-medium tracking-[-0.025em]">
        {value}
      </p>
    </div>
  );
}

function UnlockStep({
  number,
  label,
  complete,
}: {
  number: string;
  label: string;
  complete?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 border px-4 py-3 transition-colors ${
        complete
          ? "border-[#8B7653]/25 bg-[#8B7653]/[0.06]"
          : "border-black/10 bg-[#F8F5F1]"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
          complete
            ? "bg-[#171519] text-white"
            : "border border-black/10 bg-white text-black/40"
        }`}
        aria-hidden="true"
      >
        {complete ? (
          <Check className="h-3 w-3" strokeWidth={2.6} />
        ) : (
          number
        )}
      </span>

      <span
        className={`text-xs font-medium ${
          complete ? "text-black/70" : "text-black/50"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ArchetypeCard({
  label,
  archetype,
  featured = false,
}: {
  label: string;
  archetype?: {
    id?: string;
    name?: string;
    icon?: string;
    motto?: string;
    shadow?: string;
    dominance?: number;
  };
  featured?: boolean;
}) {
  if (!archetype) {
    return null;
  }

  const name =
    archetype.name ||
    formatLabel(archetype.id) ||
    "Archetype";

  return (
    <div
      className={`relative overflow-hidden border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(23,21,25,0.08)] md:p-10 ${
        featured
          ? "border-[#171519] bg-[#171519] text-white"
          : "border-black/10 bg-white text-[#171519]"
      }`}
    >
      {featured && (
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10"
          aria-hidden="true"
        />
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            {archetype.icon && (
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${
                  featured
                    ? "bg-white text-[#171519]"
                    : "bg-[#F8F5F1]"
                }`}
                aria-hidden="true"
              >
                {archetype.icon}
              </span>
            )}

            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                featured ? "text-white/45" : "text-black/45"
              }`}
            >
              {label}
            </p>
          </div>

          {typeof archetype.dominance === "number" && (
            <div
              className={`text-xs tabular-nums ${
                featured ? "text-white/40" : "text-black/40"
              }`}
            >
              {archetype.dominance}%
            </div>
          )}
        </div>

        <h3
          className={`mt-10 text-4xl font-medium tracking-[-0.04em] ${
            featured ? "text-white" : "text-[#171519]"
          }`}
        >
          {name}
        </h3>

        {archetype.motto && (
          <p
            className={`mt-5 text-base italic leading-7 ${
              featured ? "text-white/60" : "text-black/55"
            }`}
          >
            &ldquo;{archetype.motto}&rdquo;
          </p>
        )}

        {archetype.shadow && (
          <div
            className={`mt-10 border-t pt-7 ${
              featured ? "border-white/10" : "border-black/10"
            }`}
          >
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.17em] ${
                featured ? "text-white/35" : "text-black/40"
              }`}
            >
              Watch your shadow
            </p>

            <p
              className={`mt-3 text-sm leading-6 ${
                featured ? "text-white/55" : "text-black/55"
              }`}
            >
              {archetype.shadow}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function VoiceCard({
  label,
  title,
  description,
  items,
}: {
  label: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="border border-black/10 bg-white p-7 md:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-black/50">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="cursor-default rounded-full border border-black/10 bg-[#F8F5F1] px-4 py-2.5 text-sm text-black/70 transition-all duration-200 hover:border-[#171519] hover:bg-[#171519] hover:text-white"
          >
            {formatLabel(item)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ValueCard({
  value,
  index,
}: {
  value: string;
  index: number;
}) {
  return (
    <div className="group cursor-default rounded-2xl border border-black/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#171519] hover:bg-[#171519] hover:text-white">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tabular-nums text-black/35 transition-colors group-hover:text-white/35">
          {String(index + 1).padStart(2, "0")}
        </span>

        <ArrowUpRight
          className="h-3.5 w-3.5 text-black/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-14 text-2xl font-medium tracking-[-0.03em]">
        {formatLabel(value)}
      </h3>

      <p className="mt-3 text-xs text-black/40 transition-colors group-hover:text-white/45">
        A principle that shapes your brand.
      </p>
    </div>
  );
}

function IkigaiCard({
  number,
  label,
  value,
}: {
  number: string;
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-[20px] border border-black/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_12px_30px_rgba(23,21,25,0.05)] md:p-9">
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F1] text-[10px] font-semibold tabular-nums"
          aria-hidden="true"
        >
          {number}
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
          {label}
        </span>
      </div>

      <p className="mt-8 text-lg leading-7 text-black/70">
        {value}
      </p>
    </div>
  );
}

function DirectionCard({
  label,
  title,
  value,
}: {
  label: string;
  title: string;
  value: string;
}) {
  return (
    <div className="border border-black/10 bg-white p-7 md:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-7 text-base leading-7 text-black/65">
        {value}
      </p>
    </div>
  );
}

function PerceptionBar({
  left,
  right,
  value,
}: {
  left: string;
  right: string;
  value?: number;
}) {
  const safeValue =
    typeof value === "number"
      ? Math.min(Math.max(value, 0), 100)
      : 50;

  const interpretation = getInterpretation(safeValue);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/65">
          {left}
        </p>

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/65">
          {right}
        </p>
      </div>

      <div className="relative h-2 rounded-full bg-[#F1EEE9]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#171519]/10"
          style={{ width: `${safeValue}%` }}
          aria-hidden="true"
        />

        <div
          className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#171519] text-[9px] font-semibold tabular-nums text-white shadow-[0_2px_8px_rgba(23,21,25,0.15)]"
          style={{ left: `${safeValue}%` }}
        >
          {safeValue}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.14em]">
        <span className="text-black/30">0</span>

        <span className="text-[#8B7653]">{interpretation}</span>

        <span className="text-black/30">100</span>
      </div>
    </div>
  );
}

function ColorSwatch({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="border-b border-black/[0.06] bg-white p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:p-5">
      <div
        className="aspect-square rounded-xl border border-black/[0.08] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />

      <div className="mt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">
          {label}
        </p>

        <p className="mt-2 font-mono text-[10px] uppercase text-black/60">
          {value}
        </p>
      </div>
    </div>
  );
}

function ContentCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="group cursor-default rounded-[24px] border border-black/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#171519] hover:bg-[#171519] hover:text-white md:p-10">
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F1] text-[10px] font-semibold tabular-nums text-black/45 transition-colors group-hover:bg-white/10 group-hover:text-white/60"
          aria-hidden="true"
        >
          {String(number).padStart(2, "0")}
        </span>

        <ArrowUpRight
          className="h-3.5 w-3.5 text-black/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-12 text-2xl font-medium tracking-[-0.03em]">
        {title}
      </h3>

      {description && (
        <p className="mt-5 text-sm leading-6 text-black/55 transition-colors group-hover:text-white/60">
          {description}
        </p>
      )}
    </div>
  );
}

function AdviceCard({
  number,
  advice,
}: {
  number: number;
  advice: string;
}) {
  return (
    <div className="group grid gap-6 rounded-[20px] border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/25 hover:shadow-[0_12px_30px_rgba(23,21,25,0.05)] md:grid-cols-[60px_1fr_auto] md:items-center md:p-8">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F5F1] text-[10px] font-semibold tabular-nums text-black/50"
        aria-hidden="true"
      >
        {String(number).padStart(2, "0")}
      </span>

      <p className="max-w-3xl text-base leading-7 text-black/70">
        {advice}
      </p>

      <ArrowRight
        className="hidden h-4 w-4 text-black/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-black/60 md:block"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </div>
  );
}

function NextStepCard({
  number,
  title,
  description,
  href,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#171519] hover:bg-[#171519] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653] md:p-7"
    >
      <div className="flex items-start justify-between">
        <span
          className="text-[10px] font-semibold tabular-nums text-black/35 transition-colors group-hover:text-white/35"
          aria-hidden="true"
        >
          {number}
        </span>

        <ArrowUpRight
          className="h-4 w-4 text-black/25 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <div className="mt-10">
        <p className="text-base font-medium tracking-[-0.02em]">
          {title}
        </p>

        <p className="mt-2 text-sm leading-6 text-black/50 transition-colors group-hover:text-white/55">
          {description}
        </p>
      </div>
    </Link>
  );
}