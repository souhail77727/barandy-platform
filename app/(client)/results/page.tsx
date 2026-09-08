import { redirect } from "next/navigation";

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
   * ACCESS PROTECTION
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

        <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white">
              <div className="relative overflow-hidden px-7 py-14 md:px-14 md:py-20">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-black/5" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-black/5" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171519] text-xs text-white">
                      ✦
                    </span>

                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                      Brand DNA
                    </p>
                  </div>

                  <h1 className="mt-8 max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] md:text-7xl">
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

              <div className="border-t border-black/10 bg-[#171519] px-7 py-9 text-white md:px-14">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
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

                <a
                  href="/payment"
                  className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 text-xs font-medium uppercase tracking-[0.14em] text-[#171519] transition hover:bg-white/90"
                >
                  Unlock my Brand DNA
                  <span className="text-base">→</span>
                </a>
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

  const totalSections = [
    brandDNA.executivePositioning,
    voiceTone.length > 0 || voiceStyle.length > 0,
    brandDNA.primaryArchetype || brandDNA.secondaryArchetype,
    values.length > 0,
    brandDNA.ikigai,
    brandDNA.purpose || brandDNA.vision,
    brandDNA.perception,
    brandDNA.colorPalette,
    brandDNA.contentPillars && brandDNA.contentPillars.length > 0,
    brandDNA.strategicAdvices && brandDNA.strategicAdvices.length > 0,
    brandDNA.strategicManifesto,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        firstName={user.firstName}
        currentPage="results"
        showBack
      />

      {/* =====================================================
          EXPLORATION BAR
      ===================================================== */}

      <div className="sticky top-0 z-30 border-b border-black/10 bg-[#F8F5F1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 overflow-x-auto px-6 py-3 md:px-10">
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171519] text-[10px] text-white">
              ✦
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/45">
              Brand DNA
            </span>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <a
              href="#identity"
              className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/40 transition hover:text-black"
            >
              Identity
            </a>

            <a
              href="#archetypes"
              className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/40 transition hover:text-black"
            >
              Archetypes
            </a>

            <a
              href="#voice"
              className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/40 transition hover:text-black"
            >
              Voice
            </a>

            <a
              href="#purpose"
              className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/40 transition hover:text-black"
            >
              Purpose
            </a>

            <a
              href="#positioning"
              className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/40 transition hover:text-black"
            >
              Positioning
            </a>

            <a
              href="#strategy"
              className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/40 transition hover:text-black"
            >
              Strategy
            </a>
          </nav>

          <span className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-black/40">
            {totalSections} discoveries
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 md:px-10">
        {/* =====================================================
            HERO / IDENTITY
        ===================================================== */}

        <section
          id="identity"
          className="relative overflow-hidden border-b border-black/10 py-16 md:py-24"
        >
          <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full border border-black/5" />

          <div className="pointer-events-none absolute -right-20 top-22 h-56 w-56 rounded-full border border-black/5" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                ✦
              </span>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/35">
                  Your personal brand
                </p>

                <p className="mt-1 text-xs text-black/40">
                  The moment of truth.
                </p>
              </div>
            </div>

            <h1 className="mt-10 max-w-5xl text-6xl font-medium leading-[0.88] tracking-[-0.065em] md:text-8xl">
              {personName}
              <br />
              <span className="text-black/25">
                decoded.
              </span>
            </h1>

            {brandDNA.elevatorPitch && (
              <div className="mt-12 max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35">
                  Your brand in one sentence
                </p>

                <p className="mt-5 text-xl leading-8 tracking-[-0.02em] text-black/65 md:text-2xl md:leading-9">
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

            <div className="mt-10 flex items-center gap-3 text-xs text-black/35">
              <span className="h-px w-8 bg-black/20" />
              <span>Keep exploring — there is more to discover.</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            ARCHETYPES
        ===================================================== */}

        {(brandDNA.primaryArchetype ||
          brandDNA.secondaryArchetype) && (
          <section
            id="archetypes"
            className="border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number="01"
              eyebrow="The personality layer"
              title="Meet the personality behind your brand."
              description="Your archetypes reveal the energy people are most likely to feel when they experience your personal brand."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2">
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

        {(voiceTone.length > 0 || voiceStyle.length > 0) && (
          <section
            id="voice"
            className="border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number="02"
              eyebrow="The communication layer"
              title="Now, hear what your brand sounds like."
              description="Your voice is not just what you say. It is how people feel when they hear you."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {voiceTone.length > 0 && (
                <VoiceCard
                  label="Your tone"
                  description="The emotional character behind your communication."
                  items={voiceTone}
                />
              )}

              {voiceStyle.length > 0 && (
                <VoiceCard
                  label="Your style"
                  description="The way your ideas naturally come across."
                  items={voiceStyle}
                />
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            VALUES
        ===================================================== */}

        {values.length > 0 && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionHeader
              number="03"
              eyebrow="The values layer"
              title="These are the things you don't want to compromise on."
              description="Your values become your internal compass — the principles that shape how you decide, create and lead."
            />

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            className="border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number="04"
              eyebrow="The purpose layer"
              title="And here is what makes it meaningful."
              description="Your Ikigai connects what you love, what you are good at, what the world needs and what you can build value around."
            />

            <div className="mt-12 grid gap-3 md:grid-cols-2">
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
              <div className="relative mt-3 overflow-hidden rounded-[24px] bg-[#171519] px-7 py-10 text-white md:px-12 md:py-14">
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-white/10" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs text-[#171519]">
                      ✦
                    </span>

                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                      The intersection
                    </p>
                  </div>

                  <p className="mt-7 max-w-4xl text-2xl font-medium leading-9 tracking-[-0.025em] md:text-4xl md:leading-[1.3]">
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
            className="border-b border-black/10 py-16 md:py-24"
          >
            <SectionHeader
              number="05"
              eyebrow="The positioning layer"
              title="This is how the world should remember you."
              description="Your positioning turns everything we discovered into a clear space you can own."
            />

            <div className="relative mt-12 overflow-hidden rounded-[24px] border border-black/10 bg-white px-7 py-10 md:px-12 md:py-14">
              <div className="absolute left-0 top-0 h-1 w-full bg-[#171519]" />

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/35">
                Your positioning statement
              </p>

              <p className="mt-8 max-w-4xl text-2xl font-medium leading-[1.35] tracking-[-0.03em] md:text-4xl md:leading-[1.3]">
                {brandDNA.executivePositioning}
              </p>

              <div className="mt-10 flex items-center gap-3 text-xs text-black/35">
                <span className="h-px w-8 bg-black/20" />
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
              number="06"
              eyebrow="The perception layer"
              title="Your brand has a certain gravity."
              description="These dimensions show where your personal brand naturally sits between different strategic extremes."
            />

            <div className="mt-12 rounded-[24px] border border-black/10 bg-white p-7 md:p-12">
              <div className="space-y-12">
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

              <div className="mt-10 border-t border-black/10 pt-7">
                <p className="text-xs leading-5 text-black/35">
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

        {(brandDNA.purpose || brandDNA.vision) && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionHeader
              number="07"
              eyebrow="The direction layer"
              title="You know who you are. Now, where are you going?"
              description="Purpose gives your brand meaning. Vision gives it direction."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2">
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
              number="08"
              eyebrow="The visual layer"
              title="If your brand had a visual mood."
              description="This palette gives you a starting point for expressing your personality visually."
            />

            <div className="mt-12 overflow-hidden rounded-[24px] border border-black/10 bg-white">
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
            CONTENT
        ===================================================== */}

        {brandDNA.contentPillars &&
          brandDNA.contentPillars.length > 0 && (
            <section className="border-b border-black/10 py-16 md:py-24">
              <SectionHeader
                number="09"
                eyebrow="The content layer"
                title="Here is what your brand should talk about."
                description="These content territories help you stay recognizable while giving your audience something valuable to follow."
              />

              <div className="mt-12 grid gap-5 md:grid-cols-2">
                {brandDNA.contentPillars.map((pillar, index) => {
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

        {brandDNA.strategicAdvices &&
          brandDNA.strategicAdvices.length > 0 && (
            <section
              id="strategy"
              className="border-b border-black/10 py-16 md:py-24"
            >
              <SectionHeader
                number="10"
                eyebrow="The action layer"
                title="Enough discovering. Now let's use it."
                description="These are the practical moves that can turn your Brand DNA into visible action."
              />

              <div className="mt-12 space-y-3">
                {brandDNA.strategicAdvices.map((advice, index) => (
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
            <div className="relative overflow-hidden rounded-[28px] bg-[#171519] px-7 py-12 text-white md:px-14 md:py-20">
              <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10" />

              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full border border-white/5" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs text-[#171519]">
                    ✦
                  </span>

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                    11 / Your manifesto
                  </p>
                </div>

                <h2 className="mt-10 max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.04em] md:text-6xl">
                  If your brand could speak,
                  <br />
                  <span className="text-white/30">
                    this is what it would say.
                  </span>
                </h2>

                <div className="mt-12 max-w-3xl">
                  <p className="whitespace-pre-line text-lg leading-8 text-white/65 md:text-xl md:leading-9">
                    {brandDNA.strategicManifesto}
                  </p>
                </div>

                <div className="mt-12 border-t border-white/10 pt-7">
                  <p className="text-xs text-white/35">
                    Your Brand DNA is not a label. It is a direction.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            END
        ===================================================== */}

        <section className="border-t border-black/10 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171519] text-xs text-white">
                  ✦
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
              <p className="text-sm leading-6 text-black/45">
                You now have a clearer picture of who you are, how you
                communicate and where your brand can go.
              </p>

              <p className="mt-3 text-xs text-black/30">
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
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[10px] font-medium">
          {number}
        </span>

        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/35">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.045em] md:text-5xl">
        {title}
      </h2>

      <p className="mt-5 max-w-2xl text-sm leading-6 text-black/50 md:text-base">
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
    <div className="rounded-2xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-sm md:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/30">
          {number}
        </span>

        <span className="text-black/20">↗</span>
      </div>

      <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.14em] text-black/35">
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
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-[#F8F5F1] px-4 py-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${
          complete
            ? "bg-[#171519] text-white"
            : "border border-black/10 bg-white text-black/40"
        }`}
      >
        {complete ? "✓" : number}
      </span>

      <span className="text-xs text-black/55">{label}</span>
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
      className={`relative overflow-hidden rounded-[24px] border border-black/10 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md md:p-10 ${
        featured
          ? "bg-[#171519] text-white"
          : "bg-white text-[#171519]"
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10" />
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
              >
                {archetype.icon}
              </span>
            )}

            <p
              className={`text-[10px] font-medium uppercase tracking-[0.16em] ${
                featured ? "text-white/40" : "text-black/40"
              }`}
            >
              {label}
            </p>
          </div>

          {typeof archetype.dominance === "number" && (
            <div
              className={`text-xs ${
                featured ? "text-white/40" : "text-black/35"
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
            “{archetype.motto}”
          </p>
        )}

        {archetype.shadow && (
          <div
            className={`mt-10 border-t pt-7 ${
              featured
                ? "border-white/10"
                : "border-black/10"
            }`}
          >
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.15em] ${
                featured ? "text-white/35" : "text-black/35"
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
  description,
  items,
}: {
  label: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-7 md:p-10">
      <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-black/35">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
        How people should experience you.
      </h3>

      <p className="mt-3 text-sm leading-6 text-black/45">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full border border-black/10 bg-[#F8F5F1] px-4 py-2.5 text-sm text-black/65 transition hover:bg-[#171519] hover:text-white"
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
    <div className="group rounded-2xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:bg-[#171519] hover:text-white">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-black/30 group-hover:text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-black/20 transition group-hover:text-white/30">
          ↗
        </span>
      </div>

      <h3 className="mt-14 text-2xl font-medium tracking-[-0.03em]">
        {formatLabel(value)}
      </h3>

      <p className="mt-3 text-xs text-black/35 group-hover:text-white/40">
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
    <div className="rounded-[20px] border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-sm md:p-9">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F1] text-[10px]">
          {number}
        </span>

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/30">
          {label}
        </span>
      </div>

      <p className="mt-8 text-lg leading-7 text-black/65">
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
    <div className="rounded-[24px] border border-black/10 bg-white p-7 md:p-10">
      <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-black/35">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-7 text-base leading-7 text-black/60">
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

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/55">
            {left}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/55">
            {right}
          </p>
        </div>
      </div>

      <div className="relative h-2 rounded-full bg-[#F1EEE9]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#171519]/10"
          style={{
            width: `${safeValue}%`,
          }}
        />

        <div
          className="absolute top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#171519] text-[8px] text-white shadow-sm"
          style={{
            left: `${safeValue}%`,
          }}
        >
          {safeValue}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-[10px] text-black/30">
        <span>0</span>
        <span>100</span>
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
    <div className="bg-white p-4 md:p-5">
      <div
        className="aspect-square rounded-xl border border-black/10 shadow-inner"
        style={{
          backgroundColor: value,
        }}
      />

      <div className="mt-4">
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-black/35">
          {label}
        </p>

        <p className="mt-2 font-mono text-[10px] text-black/55">
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
    <div className="group rounded-[24px] border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:bg-[#171519] hover:text-white md:p-10">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F1] text-[10px] text-black/45 group-hover:bg-white/10 group-hover:text-white/60">
          {String(number).padStart(2, "0")}
        </span>

        <span className="text-black/20 group-hover:text-white/30">
          ↗
        </span>
      </div>

      <h3 className="mt-12 text-2xl font-medium tracking-[-0.03em]">
        {title}
      </h3>

      {description && (
        <p className="mt-5 text-sm leading-6 text-black/50 group-hover:text-white/55">
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
    <div className="group grid gap-6 rounded-[20px] border border-black/10 bg-white p-6 transition duration-300 hover:border-black/20 hover:shadow-sm md:grid-cols-[60px_1fr_auto] md:items-center md:p-8">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F5F1] text-[10px] text-black/45">
        {String(number).padStart(2, "0")}
      </span>

      <p className="max-w-3xl text-base leading-7 text-black/65">
        {advice}
      </p>

      <span className="hidden text-black/20 transition group-hover:translate-x-1 group-hover:text-black/50 md:block">
        →
      </span>
    </div>
  );
}