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
   * ---------------------------------------------------------
   * ACCESS PROTECTION
   * ---------------------------------------------------------
   */

  if (!user.accessGranted) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="results"
          showBack
        />

        <main className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Brand DNA
            </p>

            <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] md:text-6xl">
              Your Brand DNA is ready.
            </h1>

            <p className="mt-6 text-base leading-7 text-black/55 md:text-lg">
              Your assessment has been analyzed and your personalized Brand
              DNA profile has been generated.
            </p>

            <div className="mt-10 border border-black/10 bg-white p-8 md:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                Access restricted
              </p>

              <h2 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
                Complete payment verification to unlock your profile.
              </h2>

              <p className="mt-4 text-sm leading-6 text-black/55">
                Your Brand DNA is securely stored. Once your payment has been
                verified by the Barandy team, the complete profile will become
                available here.
              </p>

              <a
                href="/payment"
                className="mt-8 inline-flex bg-[#171519] px-7 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
              >
                View Payment Details
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * NORMALIZED DATA
   * ---------------------------------------------------------
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

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        firstName={user.firstName}
        currentPage="results"
        showBack
      />

      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="border-b border-black/10 pb-16 md:pb-24">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/40">
            Your Brand DNA
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.05em] md:text-7xl">
            {personName}
            <br />
            <span className="text-black/35">
              your personal brand, decoded.
            </span>
          </h1>

          {brandDNA.elevatorPitch && (
            <p className="mt-10 max-w-3xl text-lg leading-8 text-black/60 md:text-xl">
              {brandDNA.elevatorPitch}
            </p>
          )}

          <div className="mt-12 grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-3">
            <StatCard
              label="Primary Archetype"
              value={primaryArchetype}
            />

            <StatCard
              label="Secondary Archetype"
              value={secondaryArchetype}
            />

            <StatCard
              label="Brand Status"
              value="Defined"
            />
          </div>
        </section>

        {/* =====================================================
            POSITIONING
        ===================================================== */}

        {brandDNA.executivePositioning && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="01 / Positioning"
              title="How your brand should be perceived."
              description="The strategic position that emerges from your assessment."
            />

            <div className="mt-12 max-w-4xl">
              <p className="text-2xl font-medium leading-[1.35] tracking-[-0.025em] md:text-4xl md:leading-[1.3]">
                {brandDNA.executivePositioning}
              </p>
            </div>
          </section>
        )}

        {/* =====================================================
            VOICE
        ===================================================== */}

        {(voiceTone.length > 0 || voiceStyle.length > 0) && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="02 / Voice"
              title="How your brand sounds."
              description="The qualities that should consistently shape your communication."
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {voiceTone.length > 0 && (
                <div className="border border-black/10 bg-white p-8 md:p-10">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
                    Tone
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {voiceTone.map((tone, index) => (
                      <span
                        key={`${tone}-${index}`}
                        className="border border-black/10 px-4 py-3 text-sm"
                      >
                        {tone}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {voiceStyle.length > 0 && (
                <div className="border border-black/10 bg-white p-8 md:p-10">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
                    Style
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {voiceStyle.map((style, index) => (
                      <span
                        key={`${style}-${index}`}
                        className="border border-black/10 px-4 py-3 text-sm"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            ARCHETYPES
        ===================================================== */}

        {(brandDNA.primaryArchetype ||
          brandDNA.secondaryArchetype) && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="03 / Archetypes"
              title="The personality behind your brand."
              description="Archetypes reveal the deeper character your brand naturally communicates."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <ArchetypeCard
                label="Primary Archetype"
                archetype={brandDNA.primaryArchetype}
              />

              <ArchetypeCard
                label="Secondary Archetype"
                archetype={brandDNA.secondaryArchetype}
              />
            </div>
          </section>
        )}

        {/* =====================================================
            VALUES
        ===================================================== */}

        {values.length > 0 && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="04 / Values"
              title="What your brand stands for."
              description="The principles that should guide your decisions, behavior and communication."
            />

            <div className="mt-12 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="bg-white p-8 md:p-10"
                >
                  <span className="text-xs text-black/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-12 text-2xl font-medium tracking-[-0.025em]">
                    {formatLabel(value)}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            IKIGAI
        ===================================================== */}

        {brandDNA.ikigai && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="05 / Ikigai"
              title="The intersection that drives you."
              description="Your purpose emerges where passion, capability, contribution and professional value meet."
            />

            <div className="mt-12 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2">
              <IkigaiCard
                label="Mission"
                value={brandDNA.ikigai.mission}
              />

              <IkigaiCard
                label="Passion"
                value={brandDNA.ikigai.passion}
              />

              <IkigaiCard
                label="Vocation"
                value={brandDNA.ikigai.vocation}
              />

              <IkigaiCard
                label="Profession"
                value={brandDNA.ikigai.profession}
              />

              {brandDNA.ikigai.intersection && (
                <div className="bg-[#171519] p-8 text-white md:col-span-2 md:p-10">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                    Intersection
                  </p>

                  <p className="mt-5 max-w-3xl text-2xl font-medium leading-8 tracking-[-0.025em] md:text-3xl">
                    {brandDNA.ikigai.intersection}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            PURPOSE + VISION
        ===================================================== */}

        {(brandDNA.purpose || brandDNA.vision) && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="06 / Direction"
              title="Where your brand is going."
              description="Your purpose defines why you exist. Your vision defines where you intend to go."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {brandDNA.purpose && (
                <TextCard
                  label="Purpose"
                  value={brandDNA.purpose}
                />
              )}

              {brandDNA.vision && (
                <TextCard
                  label="Vision"
                  value={brandDNA.vision}
                />
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            PERCEPTION
        ===================================================== */}

        {brandDNA.perception && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="07 / Perception"
              title="How your brand naturally positions itself."
              description="These dimensions show the strategic balance within your personal brand."
            />

            <div className="mt-12 space-y-10">
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
          </section>
        )}

        {/* =====================================================
            COLOR PALETTE
        ===================================================== */}

        {brandDNA.colorPalette && (
          <section className="border-b border-black/10 py-16 md:py-24">
            <SectionIntro
              eyebrow="08 / Visual Identity"
              title="Your visual direction."
              description="A starting palette derived from your Brand DNA."
            />

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
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
          </section>
        )}

        {/* =====================================================
            CONTENT PILLARS
        ===================================================== */}

        {brandDNA.contentPillars &&
          brandDNA.contentPillars.length > 0 && (
            <section className="border-b border-black/10 py-16 md:py-24">
              <SectionIntro
                eyebrow="09 / Content"
                title="What your brand should talk about."
                description="Strategic content territories that reinforce your positioning."
              />

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {brandDNA.contentPillars.map((pillar, index) => {
                  if (typeof pillar === "string") {
                    return (
                      <div
                        key={`pillar-${index}`}
                        className="border border-black/10 bg-white p-8 md:p-10"
                      >
                        <span className="text-xs text-black/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <h3 className="mt-10 text-2xl font-medium tracking-[-0.025em]">
                          {pillar}
                        </h3>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`pillar-${index}`}
                      className="border border-black/10 bg-white p-8 md:p-10"
                    >
                      <span className="text-xs text-black/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="mt-10 text-2xl font-medium tracking-[-0.025em]">
                        {pillar.title || "Content Pillar"}
                      </h3>

                      {pillar.description && (
                        <p className="mt-5 text-sm leading-6 text-black/55">
                          {pillar.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        {/* =====================================================
            STRATEGIC ADVICE
        ===================================================== */}

        {brandDNA.strategicAdvices &&
          brandDNA.strategicAdvices.length > 0 && (
            <section className="border-b border-black/10 py-16 md:py-24">
              <SectionIntro
                eyebrow="10 / Strategic Direction"
                title="How to activate your brand."
                description="Practical strategic directions derived from your Brand DNA."
              />

              <div className="mt-12 space-y-px border border-black/10 bg-black/10">
                {brandDNA.strategicAdvices.map((advice, index) => (
                  <div
                    key={`advice-${index}`}
                    className="grid gap-6 bg-white p-8 md:grid-cols-[80px_1fr] md:p-10"
                  >
                    <span className="text-sm text-black/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="max-w-3xl text-base leading-7 text-black/65">
                      {advice}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* =====================================================
            MANIFESTO
        ===================================================== */}

        {brandDNA.strategicManifesto && (
          <section className="py-16 md:py-28">
            <div className="bg-[#171519] px-8 py-14 text-white md:px-16 md:py-20">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                11 / Manifesto
              </p>

              <h2 className="mt-8 max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.035em] md:text-5xl">
                Your brand, in your own words.
              </h2>

              <div className="mt-10 max-w-3xl">
                <p className="whitespace-pre-line text-lg leading-8 text-white/65 md:text-xl md:leading-9">
                  {brandDNA.strategicManifesto}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <section className="border-t border-black/10 pt-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em]">
                BARANDY
              </p>

              <p className="mt-2 text-xs text-black/40">
                Personal Brand Intelligence
              </p>
            </div>

            <p className="max-w-md text-xs leading-5 text-black/35 md:text-right">
              Your Brand DNA is a strategic foundation. The value comes from
              consistently translating these insights into how you communicate,
              create and position yourself.
            </p>
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

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-black/50">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-7 md:p-8">
      <p className="text-xs uppercase tracking-[0.15em] text-black/40">
        {label}
      </p>

      <p className="mt-5 text-xl font-medium tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}

function ArchetypeCard({
  label,
  archetype,
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
}) {
  if (!archetype) {
    return null;
  }

  const name =
    archetype.name ||
    formatLabel(archetype.id) ||
    "Archetype";

  return (
    <div className="border border-black/10 bg-white p-8 md:p-10">
      <div className="flex items-start justify-between gap-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
          {label}
        </p>

        {typeof archetype.dominance === "number" && (
          <span className="text-xs text-black/35">
            {archetype.dominance}%
          </span>
        )}
      </div>

      <h3 className="mt-8 text-3xl font-medium tracking-[-0.035em]">
        {name}
      </h3>

      {archetype.motto && (
        <p className="mt-5 text-base italic leading-7 text-black/55">
          “{archetype.motto}”
        </p>
      )}

      {archetype.shadow && (
        <div className="mt-8 border-t border-black/10 pt-6">
          <p className="text-xs uppercase tracking-[0.14em] text-black/35">
            Shadow
          </p>

          <p className="mt-3 text-sm leading-6 text-black/55">
            {archetype.shadow}
          </p>
        </div>
      )}
    </div>
  );
}

function IkigaiCard({
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
    <div className="bg-white p-8 md:p-10">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
        {label}
      </p>

      <p className="mt-6 text-lg leading-7 text-black/70">
        {value}
      </p>
    </div>
  );
}

function TextCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-black/10 bg-white p-8 md:p-10">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
        {label}
      </p>

      <p className="mt-6 text-lg leading-8 text-black/65">
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
      <div className="mb-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.12em] text-black/40">
        <span>{left}</span>
        <span>{right}</span>
      </div>

      <div className="relative h-px bg-black/15">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#171519]"
          style={{
            left: `${safeValue}%`,
          }}
        />
      </div>

      <div className="mt-2 text-right text-[10px] text-black/30">
        {safeValue}%
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
    <div>
      <div
        className="aspect-square border border-black/10"
        style={{
          backgroundColor: value,
        }}
      />

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.12em] text-black/40">
          {label}
        </p>

        <p className="mt-2 font-mono text-xs text-black/55">
          {value}
        </p>
      </div>
    </div>
  );
}