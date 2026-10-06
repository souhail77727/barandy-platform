
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { Manrope, DM_Sans } from "next/font/google";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ClientHeader from "@/components/layout/ClientHeader";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOTAL_ASSESSMENT_STEPS = 8;

export default async function ClientDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      accessGranted: true,
      assessments: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          status: true,
          progress: true,
          updatedAt: true,
          result: { select: { id: true } },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const assessment = user.assessments[0];
  const payment = user.payments[0];

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "there";

  const firstName = user.firstName || displayName;

  const assessmentCompleted = assessment?.status === "COMPLETED";
  const assessmentInProgress = assessment?.status === "IN_PROGRESS";
  const assessmentNotStarted =
    !assessment || assessment.status === "NOT_STARTED";

  const brandDNAReady = Boolean(assessment?.result);
  const accessGranted = user.accessGranted;

  const assessmentProgress = Math.min(
    100,
    Math.round(((assessment?.progress ?? 0) / TOTAL_ASSESSMENT_STEPS) * 100)
  );

  let primaryAction = {
    label: "Start Assessment",
    href: "/assessment",
    description:
      "Discover the foundations of your personal brand through a guided assessment.",
  };

  if (assessmentInProgress) {
    primaryAction = {
      label: "Continue Assessment",
      href: "/assessment",
      description:
        "Pick up where you left off. Your progress has been saved automatically.",
    };
  }

  if (assessmentCompleted && !accessGranted) {
    primaryAction = {
      label: "Unlock Brand DNA",
      href: "/payment",
      description:
        "Your assessment is complete. Your personalized Brand DNA is ready.",
    };
  }

  if (assessmentCompleted && accessGranted) {
    primaryAction = {
      label: "Explore Brand DNA",
      href: "/results",
      description:
        "Your personalized strategic profile is ready to explore.",
    };
  }

  const journeyStage = accessGranted
    ? 3
    : assessmentCompleted
      ? 2
      : assessmentInProgress
        ? 1
        : 0;

  const stageStatus =
    journeyStage === 3
      ? "Your Brand DNA is unlocked."
      : journeyStage === 2
        ? "Assessment complete — your Brand DNA is ready to unlock."
        : journeyStage === 1
          ? `Assessment in progress — ${assessmentProgress}% complete.`
          : "Your journey starts with understanding your brand.";

  const steps = [
    {
      label: "Assessment",
      done: assessmentCompleted,
      current: journeyStage <= 1,
    },
    {
      label: "Brand DNA",
      done: accessGranted,
      current: journeyStage === 2,
    },
    {
      label: "Your Profile",
      done: accessGranted,
      current: journeyStage === 3,
    },
  ];

  return (
    <main
      className={`${manrope.variable} ${dmSans.variable} min-h-screen bg-[#F8F5F1] text-[#171519]`}
    >
      <div className="font-[var(--font-dm-sans)]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="dashboard"
        />

        <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 md:pt-12 lg:px-8">
          {/* HERO */}
          <section className="relative overflow-hidden border-b border-black/10 pb-10 md:pb-14">
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8B7653]" />
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">
                  Client dashboard
                </p>
              </div>

              <h1 className="mt-5 max-w-3xl font-[var(--font-manrope)] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                Welcome,{" "}
                <span className="font-medium text-[#8B7653]">
                  {firstName}
                </span>
                .
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-black/50 md:text-base md:leading-7">
                {primaryAction.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={primaryAction.href}
                  className="group inline-flex min-h-[48px] w-fit items-center justify-center gap-3 bg-[#171519] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
                >
                  {primaryAction.label}

                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.7}
                  />
                </Link>

                {assessmentCompleted && (
                  <Link
                    href="/assessment"
                    className="inline-flex min-h-[48px] items-center justify-center px-5 py-3.5 text-sm font-medium text-black/50 transition-colors hover:text-[#171519]"
                  >
                    Review assessment
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* JOURNEY */}
          <section
            className="mt-10 md:mt-12"
            aria-label="Your progress through the Barandy journey"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-[var(--font-manrope)] text-sm font-semibold">
                  Your journey
                </p>
                <p className="mt-1 text-xs text-black/40">
                  {stageStatus}
                </p>
              </div>

              {assessmentInProgress && (
                <span className="text-xs font-medium text-[#8B7653]">
                  {assessmentProgress}%
                </span>
              )}
            </div>

            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={step.label}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-all ${
                        step.done
                          ? "border-[#171519] bg-[#171519] text-white"
                          : step.current
                            ? "border-[#8B7653] bg-white text-[#8B7653] shadow-[0_0_0_4px_rgba(139,118,83,0.08)]"
                            : "border-black/10 bg-white text-black/25"
                      }`}
                    >
                      {step.done ? (
                        <Check
                          className="h-4 w-4"
                          strokeWidth={2}
                        />
                      ) : (
                        i + 1
                      )}
                    </div>

                    <span
                      className={`text-xs ${
                        step.done || step.current
                          ? "font-medium text-black/70"
                          : "text-black/30"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className={`mx-3 h-px flex-1 transition-colors ${
                        steps[i + 1].done || steps[i + 1].current
                          ? "bg-[#8B7653]/40"
                          : "bg-black/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* STATUS CARDS */}
          <section className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2">
            {/* ASSESSMENT */}
            <article className="group border border-black/10 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_12px_40px_rgba(23,21,25,0.05)] md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/35">
                    Step 01
                  </p>

                  <h2 className="mt-2 font-[var(--font-manrope)] text-xl font-semibold tracking-[-0.025em]">
                    Assessment
                  </h2>
                </div>

                <StatusPill
                  label={
                    assessmentCompleted
                      ? "Completed"
                      : assessmentInProgress
                        ? "In progress"
                        : "Not started"
                  }
                  tone={
                    assessmentCompleted
                      ? "done"
                      : assessmentInProgress
                        ? "active"
                        : "idle"
                  }
                />
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-black/50">
                {assessmentCompleted
                  ? "Your answers have been analyzed and saved securely."
                  : assessmentInProgress
                    ? "Continue from where you stopped. Your progress is saved automatically."
                    : "A guided diagnostic of your values, purpose and personal brand archetype."}
              </p>

              {assessmentInProgress && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-[11px] text-black/35">
                    <span>Progress</span>
                    <span>{assessmentProgress}%</span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#171519] transition-all duration-500"
                      style={{ width: `${assessmentProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                href="/assessment"
                className="group/link mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#171519]"
              >
                {assessmentCompleted
                  ? "Review your answers"
                  : assessmentInProgress
                    ? "Continue assessment"
                    : "Begin assessment"}

                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1"
                  strokeWidth={1.8}
                />
              </Link>
            </article>

            {/* BRAND DNA */}
            <article className="group relative overflow-hidden border border-[#171519] bg-[#171519] p-6 text-white md:p-7">
              <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full border border-white/[0.04]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
                      Step 02
                    </p>

                    <h2 className="mt-2 flex items-center gap-2 font-[var(--font-manrope)] text-xl font-semibold tracking-[-0.025em]">
                      Brand DNA

                      {accessGranted ? (
                        <Sparkles
                          className="h-4 w-4 text-[#C9A876]"
                          strokeWidth={1.7}
                        />
                      ) : (
                        <LockKeyhole
                          className="h-4 w-4 text-white/30"
                          strokeWidth={1.7}
                        />
                      )}
                    </h2>
                  </div>

                  <StatusPill
                    label={
                      accessGranted
                        ? "Unlocked"
                        : brandDNAReady
                          ? "Ready to unlock"
                          : "Not ready"
                    }
                    tone={
                      accessGranted
                        ? "done"
                        : brandDNAReady
                          ? "active"
                          : "idle"
                    }
                    dark
                  />
                </div>

                {accessGranted ? (
                  <>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
                      Your personalized strategic profile is ready — positioning,
                      voice, archetype and direction, built from your answers.
                    </p>

                    <Link
                      href="/results"
                      className="group/cta mt-7 inline-flex min-h-[46px] items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-[#171519] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
                    >
                      Explore my Brand DNA

                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1"
                        strokeWidth={1.8}
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
                      {brandDNAReady
                        ? "Your Brand DNA has been generated. Unlock it to access your personalized profile."
                        : "Complete your assessment to generate your personalized Brand DNA."}
                    </p>

                    <ul className="mt-5 space-y-2.5 text-sm text-white/45">
                      <li className="flex items-center gap-2.5">
                        <span className="h-1 w-1 rounded-full bg-[#C9A876]" />
                        Brand positioning and archetype
                      </li>

                      <li className="flex items-center gap-2.5">
                        <span className="h-1 w-1 rounded-full bg-[#C9A876]" />
                        Strategic voice and tone
                      </li>

                      <li className="flex items-center gap-2.5">
                        <span className="h-1 w-1 rounded-full bg-[#C9A876]" />
                        Personalized direction
                      </li>
                    </ul>

                    {brandDNAReady && (
                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                        <div>
                          <p className="text-xs text-white/35">
                            {payment?.status === "PAID"
                              ? "Payment received — awaiting approval"
                              : payment?.status === "PENDING"
                                ? "Payment pending verification"
                                : payment?.status === "FAILED"
                                  ? "Payment requires attention"
                                  : "One-time unlock"}
                          </p>

                          <p className="mt-1 font-[var(--font-manrope)] text-xl font-semibold">
                            {payment?.amount ?? 100}{" "}
                            <span className="text-xs font-normal text-white/35">
                              {payment?.currency ?? "TND"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    <Link
                      href={brandDNAReady ? "/payment" : "/assessment"}
                      className="group/cta mt-7 inline-flex min-h-[46px] items-center gap-2 border border-white/20 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.06]"
                    >
                      {brandDNAReady
                        ? "Unlock Brand DNA"
                        : "Complete assessment first"}

                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1"
                        strokeWidth={1.8}
                      />
                    </Link>
                  </>
                )}
              </div>
            </article>
          </section>

          {/* FINAL CTA */}
          <section className="mt-8 border border-black/10 bg-[#ECE7E0] p-6 md:mt-10 md:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/35">
                  Your next move
                </p>

                <h2 className="mt-2 max-w-xl font-[var(--font-manrope)] text-xl font-semibold tracking-[-0.025em] md:text-2xl">
                  {accessGranted
                    ? "Your Brand DNA is ready. Start putting it into action."
                    : assessmentCompleted
                      ? "Your assessment is done. Unlock your Brand DNA."
                      : assessmentInProgress
                        ? "You're already on your way."
                        : "Start discovering what makes your brand yours."}
                </h2>
              </div>

              <Link
                href={primaryAction.href}
                className="group inline-flex min-h-[46px] shrink-0 items-center justify-center gap-3 bg-[#171519] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black"
              >
                {primaryAction.label}

                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.7}
                />
              </Link>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/LOGO.png"
                alt="Barandy"
                width={80}
                height={30}
                className="h-auto w-16 opacity-60"
              />

              <span className="text-xs text-black/35">
                Personal Brand Intelligence
              </span>
            </div>

            <nav
              aria-label="Dashboard navigation"
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              <Link
                href="/dashboard"
                className="text-xs text-black/40 transition hover:text-black"
              >
                Dashboard
              </Link>

              <Link
                href="/assessment"
                className="text-xs text-black/40 transition hover:text-black"
              >
                Assessment
              </Link>

              {assessmentCompleted && (
                <Link
                  href="/payment"
                  className="text-xs text-black/40 transition hover:text-black"
                >
                  Payment
                </Link>
              )}

              {accessGranted && (
                <Link
                  href="/results"
                  className="text-xs text-black/40 transition hover:text-black"
                >
                  Brand DNA
                </Link>
              )}

              <Link
                href="/"
                className="text-xs text-black/40 transition hover:text-black"
              >
                Home
              </Link>
            </nav>
          </footer>
        </div>
      </div>
    </main>
  );
}

function StatusPill({
  label,
  tone,
  dark = false,
}: {
  label: string;
  tone: "done" | "active" | "idle";
  dark?: boolean;
}) {
  const styles = dark
    ? {
        done: "bg-white/10 text-white/80",
        active: "bg-[#C9A876]/15 text-[#C9A876]",
        idle: "bg-white/[0.06] text-white/40",
      }
    : {
        done: "bg-[#171519]/5 text-[#171519]",
        active: "bg-[#8B7653]/10 text-[#8B7653]",
        idle: "bg-black/5 text-black/40",
      };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium ${styles[tone]}`}
    >
      {tone === "done" && (
        <Check
          className="h-3 w-3"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}

      {tone === "active" && (
        <Clock
          className="h-3 w-3"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}

      {label}
    </span>
  );
}

