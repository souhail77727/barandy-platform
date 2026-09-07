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

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ClientHeader from "@/components/layout/ClientHeader";

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
  const assessmentNotStarted = !assessment || assessment.status === "NOT_STARTED";

  const brandDNAReady = Boolean(assessment?.result);
  const accessGranted = user.accessGranted;

  const assessmentProgress = Math.min(
    100,
    Math.round(((assessment?.progress ?? 0) / TOTAL_ASSESSMENT_STEPS) * 100)
  );

  /* ---------------------------------------------------------
   * PRIMARY ACTION — unchanged logic
   * --------------------------------------------------------- */
  let primaryAction = {
    label: "Start Assessment",
    href: "/assessment",
    description: "Begin your personal brand discovery journey.",
  };

  if (assessmentInProgress) {
    primaryAction = {
      label: "Continue Assessment",
      href: "/assessment",
      description: "Continue where you left off. Your progress is saved.",
    };
  }

  if (assessmentCompleted && !accessGranted) {
    primaryAction = {
      label: "Unlock Brand DNA",
      href: "/payment",
      description: "Your assessment is complete. Your Brand DNA is ready.",
    };
  }

  if (assessmentCompleted && accessGranted) {
    primaryAction = {
      label: "Explore Brand DNA",
      href: "/results",
      description: "Your personalized Brand DNA is ready to explore.",
    };
  }

  /* ---------------------------------------------------------
   * JOURNEY STAGE — unchanged logic
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
    { label: "Assessment", done: assessmentCompleted, current: journeyStage <= 1 },
    { label: "Brand DNA", done: accessGranted, current: journeyStage === 2 },
    { label: "Your Profile", done: accessGranted, current: journeyStage === 3 },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader firstName={user.firstName} currentPage="dashboard" />

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-6 md:pt-14 lg:px-8">
        {/* =====================================================
            HERO — one primary action, no decorative noise
        ====================================================== */}
        <section className="border-b border-black/10 pb-10 md:pb-12">
          <p className="text-xs font-medium tracking-wide text-black/40">
            Client dashboard
          </p>

          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Welcome,{" "}
            <span className="font-serif font-normal italic text-[#8B7653]">
              {firstName}
            </span>
            .
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-black/50 md:text-base">
            {primaryAction.description}
          </p>

          <Link
            href={primaryAction.href}
            className="group mt-7 inline-flex min-h-[44px] w-fit items-center gap-3 bg-[#171519] px-6 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
          >
            {primaryAction.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.7}
            />
          </Link>
        </section>

        {/* =====================================================
            STEPPER — where the user stands, in one line
        ====================================================== */}
        <section
          className="mt-10 md:mt-12"
          aria-label="Your progress through the Barandy journey"
        >
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                      step.done
                        ? "border-[#171519] bg-[#171519] text-white"
                        : step.current
                          ? "border-[#8B7653] bg-white text-[#8B7653]"
                          : "border-black/15 bg-white text-black/30"
                    }`}
                    aria-hidden="true"
                  >
                    {step.done ? <Check className="h-4 w-4" strokeWidth={2} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs ${
                      step.done || step.current ? "text-black/70" : "text-black/35"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-3 h-px flex-1 transition-colors ${
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
              ASSESSMENT
          -------------------------------------------------- */}
          <article className="border border-black/10 bg-white p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">Assessment</h2>
              <StatusPill
                label={
                  assessmentCompleted
                    ? "Completed"
                    : assessmentInProgress
                      ? "In progress"
                      : "Not started"
                }
                tone={assessmentCompleted ? "done" : assessmentInProgress ? "active" : "idle"}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-black/50">
              {assessmentCompleted
                ? "Your answers have been analyzed and saved securely."
                : assessmentInProgress
                  ? "Continue from where you stopped — your progress is saved automatically."
                  : "A short, guided diagnostic of your values, purpose and personal brand archetype."}
            </p>

            {assessmentInProgress && (
              <div className="mt-5">
                <div className="h-1 rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-[#171519] transition-all duration-500"
                    style={{ width: `${assessmentProgress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-black/40">
                  {assessmentProgress}% complete
                </p>
              </div>
            )}

            <Link
              href="/assessment"
              className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#171519] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
            >
              {assessmentCompleted
                ? "Review your answers"
                : assessmentInProgress
                  ? "Continue assessment"
                  : "Begin assessment"}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </Link>
          </article>

          {/* --------------------------------------------------
              BRAND DNA — merges the old card + banner into
              a single, state-aware source of truth
          -------------------------------------------------- */}
          <article className="border border-black/10 bg-[#171519] p-6 text-white md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                Brand DNA
                {accessGranted ? (
                  <Sparkles className="h-4 w-4 text-[#C9A876]" strokeWidth={1.7} aria-hidden="true" />
                ) : (
                  <LockKeyhole className="h-4 w-4 text-white/40" strokeWidth={1.7} aria-hidden="true" />
                )}
              </h2>
              <StatusPill
                label={accessGranted ? "Unlocked" : brandDNAReady ? "Ready to unlock" : "Not ready"}
                tone={accessGranted ? "done" : brandDNAReady ? "active" : "idle"}
                dark
              />
            </div>

            {accessGranted ? (
              <>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  Your personalized strategic profile is ready — positioning, voice,
                  archetype and direction, built from your answers.
                </p>
                <Link
                  href="/results"
                  className="group mt-6 inline-flex min-h-[44px] items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-[#171519] transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {brandDNAReady
                    ? "Your Brand DNA has been generated. Unlock it to see:"
                    : "Once your assessment is complete, your Brand DNA will include:"}
                </p>

                <ul className="mt-3 space-y-1.5 text-sm text-white/50">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#C9A876]" aria-hidden="true" />
                    Your brand positioning and archetype
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#C9A876]" aria-hidden="true" />
                    Your strategic voice and tone
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#C9A876]" aria-hidden="true" />
                    A personalized direction to act on
                  </li>
                </ul>

                {brandDNAReady && (
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-white/40">
                        {payment?.status === "PAID"
                          ? "Payment received — awaiting approval"
                          : payment?.status === "PENDING"
                            ? "Payment pending verification"
                            : payment?.status === "FAILED"
                              ? "Payment requires attention"
                              : "One-time unlock"}
                      </p>
                      <p className="mt-0.5 text-lg font-semibold">
                        {payment?.amount ?? 100}{" "}
                        <span className="text-xs font-normal text-white/40">
                          {payment?.currency ?? "TND"}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <Link
                  href={brandDNAReady ? "/payment" : "/assessment"}
                  className="group mt-6 inline-flex min-h-[44px] items-center gap-2 border border-white/25 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {brandDNAReady ? "Unlock Brand DNA" : "Complete assessment first"}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
              </>
            )}
          </article>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/LOGO.png"
              alt="Barandy"
              width={80}
              height={30}
              className="h-auto w-16 opacity-60"
            />
            <span className="text-xs text-black/35">Personal Brand Intelligence</span>
          </div>

          <nav aria-label="Dashboard navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/dashboard"
              className="text-xs text-black/40 transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
            >
              Dashboard
            </Link>
            <Link
              href="/assessment"
              className="text-xs text-black/40 transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
            >
              Assessment
            </Link>
            {assessmentCompleted && (
              <Link
                href="/payment"
                className="text-xs text-black/40 transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
              >
                Payment
              </Link>
            )}
            {accessGranted && (
              <Link
                href="/results"
                className="text-xs text-black/40 transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
              >
                Brand DNA
              </Link>
            )}
            <Link
              href="/"
              className="text-xs text-black/40 transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7653]"
            >
              Home
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}

/* ============================================================
   STATUS PILL — replaces StatusBadge + PaymentStatusBadge
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
      className={`inline-flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs font-medium ${styles[tone]}`}
    >
      {tone === "done" && <Check className="h-3 w-3" strokeWidth={2} aria-hidden="true" />}
      {tone === "active" && <Clock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />}
      {label}
    </span>
  );
}