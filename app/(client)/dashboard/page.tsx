import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ClientHeader from "@/components/layout/ClientHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOTAL_ASSESSMENT_STEPS = 8;

/* ---------------------------------------------------------
 * TIME-AWARE GREETING
 * --------------------------------------------------------- */
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/* ---------------------------------------------------------
 * RELATIVE TIME
 * --------------------------------------------------------- */
function getRelativeTime(date: Date | null | undefined): string | null {
  if (!date) return null;

  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7)
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? "" : "s"} ago`;

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

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

  const timeGreeting = getTimeGreeting();
  const lastUpdated = getRelativeTime(assessment?.updatedAt);

  /* ---------------------------------------------------------
   * PRIMARY ACTION
   * --------------------------------------------------------- */
  let primaryAction = {
    label: "Start your assessment",
    href: "/assessment",
    description:
      "A short, guided diagnostic of your values, purpose and brand archetype.",
  };

  if (assessmentInProgress) {
    primaryAction = {
      label: "Continue your assessment",
      href: "/assessment",
      description: `You're ${assessmentProgress}% through. Your progress is saved automatically.`,
    };
  }

  if (assessmentCompleted && !accessGranted) {
    primaryAction = {
      label: "Unlock your Brand DNA",
      href: "/payment",
      description:
        "Your assessment is complete. One step away from your strategic brand profile.",
    };
  }

  if (assessmentCompleted && accessGranted) {
    primaryAction = {
      label: "Explore your Brand DNA",
      href: "/results",
      description:
        "Your strategic profile is ready — positioning, voice, archetype and direction.",
    };
  }

  /* ---------------------------------------------------------
   * JOURNEY STAGE
   * --------------------------------------------------------- */
  const journeyStage = accessGranted
    ? 3
    : assessmentCompleted
      ? 2
      : assessmentInProgress
        ? 1
        : 0;

  const stageStatus =
    journeyStage === 3
      ? "Your journey is complete."
      : journeyStage === 2
        ? "Assessment complete — your Brand DNA is ready to unlock."
        : journeyStage === 1
          ? `Assessment in progress — ${assessmentProgress}% complete.`
          : "Your journey starts with the assessment.";

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

  /* ---------------------------------------------------------
   * PAYMENT STATUS MICROCOPY
   * --------------------------------------------------------- */
  const paymentStatusCopy = (() => {
    if (!payment) return "One-time unlock";
    switch (payment.status) {
      case "PAID":
        return "Payment received — awaiting approval";
      case "PENDING":
        return "Payment pending verification";
      case "FAILED":
        return "Payment requires attention";
      default:
        return "One-time unlock";
    }
  })();

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader firstName={user.firstName} currentPage="dashboard" />

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-6 md:pt-14 lg:px-8">
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="border-b border-black/10 pb-10 md:pb-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-wide text-black/40">
            <span>{timeGreeting}</span>
            <span className="h-1 w-1 rounded-full bg-black/20" aria-hidden="true" />
            <span className="text-black/35">{primaryAction.description}</span>
          </div>

          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-[2.75rem]">
            Welcome back,{" "}
            <span className="font-serif font-normal italic text-[#8B7653]">
              {firstName}
            </span>
            .
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href={primaryAction.href}
              className="group inline-flex min-h-[48px] items-center gap-3 bg-[#171519] px-6 py-3.5 text-sm font-medium text-white shadow-[0_1px_0_rgba(23,21,25,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_8px_24px_rgba(23,21,25,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
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
                className="inline-flex min-h-[48px] items-center gap-1.5 text-sm font-medium text-black/50 underline-offset-4 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
              >
                Review your answers
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </Link>
            )}
          </div>
        </section>

        {/* =====================================================
            STEPPER
        ====================================================== */}
        <section
          className="mt-10 md:mt-12"
          aria-label="Your progress through the Barandy journey"
        >
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-1 items-center last:flex-none"
              >
                <div className="flex flex-col items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                      step.done
                        ? "border-[#171519] bg-[#171519] text-white shadow-[0_2px_8px_rgba(23,21,25,0.15)]"
                        : step.current
                          ? "border-[#8B7653] bg-white text-[#8B7653] ring-4 ring-[#8B7653]/10"
                          : "border-black/15 bg-white text-black/30"
                    }`}
                    aria-hidden="true"
                  >
                    {step.done ? (
                      <Check className="h-4 w-4" strokeWidth={2.4} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`whitespace-nowrap text-xs font-medium transition-colors ${
                      step.done
                        ? "text-black/70"
                        : step.current
                          ? "text-[#8B7653]"
                          : "text-black/35"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-3 h-px flex-1 transition-colors duration-500 ${
                      steps[i + 1].done || steps[i + 1].current
                        ? "bg-[#8B7653]/50"
                        : "bg-black/10"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-black/40">{stageStatus}</p>
        </section>

        {/* =====================================================
            STATUS CARDS
        ====================================================== */}
        <section className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
          {/* --------------------------------------------------
              ASSESSMENT CARD
          -------------------------------------------------- */}
          <article className="flex flex-col border border-black/10 bg-white p-6 transition-colors duration-200 hover:border-black/20 md:p-7">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Assessment
              </h2>
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

            <p className="mt-3 flex-1 text-sm leading-6 text-black/50">
              {assessmentCompleted
                ? "Your answers have been analyzed and saved securely."
                : assessmentInProgress
                  ? "Continue from where you stopped — your progress is saved automatically."
                  : "A short, guided diagnostic of your values, purpose and personal brand archetype."}
            </p>

            {assessmentInProgress && (
              <div className="mt-5">
                <div className="h-1 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-[#171519] transition-all duration-700 ease-out"
                    style={{ width: `${assessmentProgress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-black/40">
                    {assessmentProgress}% complete
                  </span>
                  {lastUpdated && (
                    <span className="text-black/30">{lastUpdated}</span>
                  )}
                </div>
              </div>
            )}

            {assessmentCompleted && lastUpdated && (
              <p className="mt-4 text-xs text-black/35">
                Completed {lastUpdated}
              </p>
            )}

            <Link
              href="/assessment"
              className="group mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#171519] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
            >
              {assessmentCompleted
                ? "Review your answers"
                : assessmentInProgress
                  ? "Continue assessment"
                  : "Begin assessment"}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </article>

          {/* --------------------------------------------------
              BRAND DNA CARD
          -------------------------------------------------- */}
          <article className="relative flex flex-col overflow-hidden border border-[#171519] bg-[#171519] p-6 text-white md:p-7">
            {/* Subtle accent glow when unlocked */}
            {accessGranted && (
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#C9A876]/10 blur-3xl"
                aria-hidden="true"
              />
            )}

            <div className="relative flex items-start justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                Brand DNA
                {accessGranted ? (
                  <Sparkles
                    className="h-4 w-4 text-[#C9A876]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                ) : (
                  <LockKeyhole
                    className="h-4 w-4 text-white/40"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                )}
              </h2>
              <StatusPill
                label={
                  accessGranted
                    ? "Unlocked"
                    : brandDNAReady
                      ? "Ready to unlock"
                      : "Not ready"
                }
                tone={
                  accessGranted ? "done" : brandDNAReady ? "active" : "idle"
                }
                dark
              />
            </div>

            {accessGranted ? (
              <>
                <p className="relative mt-3 flex-1 text-sm leading-6 text-white/60">
                  Your personalized strategic profile is ready — positioning,
                  voice, archetype and direction, built from your answers.
                </p>

                <Link
                  href="/results"
                  className="group relative mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-[#171519] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore my Brand DNA
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
              </>
            ) : (
              <>
                <p className="relative mt-3 text-sm leading-6 text-white/60">
                  {brandDNAReady
                    ? "Your Brand DNA has been generated. Unlock it to see:"
                    : "Once your assessment is complete, your Brand DNA will include:"}
                </p>

                <ul className="relative mt-4 space-y-2 text-sm text-white/55">
                  <li className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C9A876]"
                      aria-hidden="true"
                    />
                    Your brand positioning and archetype
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C9A876]"
                      aria-hidden="true"
                    />
                    Your strategic voice and tone
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C9A876]"
                      aria-hidden="true"
                    />
                    A personalized direction to act on
                  </li>
                </ul>

                <div className="relative mt-6 flex flex-1 items-end">
                  <div className="w-full">
                    {brandDNAReady && (
                      <div className="mb-4 flex items-baseline justify-between border-t border-white/10 pt-4">
                        <p className="text-xs text-white/40">
                          {paymentStatusCopy}
                        </p>
                        <p className="text-lg font-semibold tabular-nums">
                          {payment?.amount ?? 100}{" "}
                          <span className="text-xs font-normal text-white/40">
                            {payment?.currency ?? "TND"}
                          </span>
                        </p>
                      </div>
                    )}

                    <Link
                      href={brandDNAReady ? "/payment" : "/assessment"}
                      className="group inline-flex min-h-[44px] items-center gap-2 border border-white/25 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {brandDNAReady
                        ? "Unlock Brand DNA"
                        : "Complete assessment first"}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.8}
                      />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </article>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-black/10 pt-6 sm:flex-row sm:gap-4">
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
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <FooterLink href="/dashboard">Dashboard</FooterLink>
            <FooterLink href="/assessment">Assessment</FooterLink>
            {assessmentCompleted && (
              <FooterLink href="/payment">Payment</FooterLink>
            )}
            {accessGranted && (
              <FooterLink href="/results">Brand DNA</FooterLink>
            )}
            <FooterLink href="/">Home</FooterLink>
          </nav>
        </footer>
      </div>
    </main>
  );
}

/* ============================================================
   FOOTER LINK
============================================================ */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs text-black/40 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
    >
      {children}
    </Link>
  );
}

/* ============================================================
   STATUS PILL
============================================================ */
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
        done: "bg-white/10 text-white/85",
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
      className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium tracking-wide ${styles[tone]}`}
    >
      {tone === "done" && (
        <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
      )}
      {tone === "active" && (
        <Clock className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}