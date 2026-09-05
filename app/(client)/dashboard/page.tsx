
import Link from "next/link";
import { redirect } from "next/navigation";

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
    where: {
      id: session.user.id,
    },
    select: {
      firstName: true,
      lastName: true,
      accessGranted: true,

      assessments: {
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
        select: {
          status: true,
          progress: true,
          updatedAt: true,
          result: {
            select: {
              id: true,
            },
          },
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
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
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || "there";

  const assessmentCompleted =
    assessment?.status === "COMPLETED";

  const assessmentInProgress =
    assessment?.status === "IN_PROGRESS";

  const assessmentNotStarted =
    !assessment ||
    assessment.status === "NOT_STARTED";

  const brandDNAReady = Boolean(assessment?.result);

  const accessGranted = user.accessGranted;

  /*
   * The database stores assessment.progress
   * as the current step number.
   */
  const assessmentProgress = Math.min(
    100,
    Math.round(
      ((assessment?.progress ?? 0) /
        TOTAL_ASSESSMENT_STEPS) *
        100
    )
  );

  /*
   * Determine the main action the client
   * should take next.
   */
  let primaryAction = {
    label: "Start Assessment",
    href: "/assessment",
  };

  if (assessmentInProgress) {
    primaryAction = {
      label: "Continue Assessment",
      href: "/assessment",
    };
  }

  if (assessmentCompleted && !accessGranted) {
    primaryAction = {
      label: "View Payment Instructions",
      href: "/payment",
    };
  }

  if (assessmentCompleted && accessGranted) {
    primaryAction = {
      label: "View My Brand DNA",
      href: "/results",
    };
  }

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      {/* =====================================================
          GLOBAL CLIENT HEADER
      ====================================================== */}

      <ClientHeader
        firstName={user.firstName}
        currentPage="dashboard"
      />

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-12">
        {/* =====================================================
            WELCOME
        ====================================================== */}

        <section className="py-12 md:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
            Welcome back
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
            {displayName}.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55">
            Your personal brand journey, from assessment to
            Brand DNA.
          </p>

          {/* MAIN ACTIONS */}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={primaryAction.href}
              className="inline-flex items-center bg-[#171519] px-7 py-4 text-sm font-medium text-white transition hover:bg-black/80"
            >
              {primaryAction.label}

              <span className="ml-4">
                →
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center border border-black/10 px-6 py-4 text-sm font-medium text-black/55 transition hover:border-black/20 hover:bg-white hover:text-black"
            >
              ← Back to Home
            </Link>
          </div>
        </section>

        {/* =====================================================
            CURRENT STATUS
        ====================================================== */}

        <section className="mb-12">
          <div className="border border-black/10 bg-white p-6 md:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  Current status
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {accessGranted
                    ? "Your Brand DNA is ready."
                    : assessmentCompleted
                      ? "Your assessment is complete."
                      : assessmentInProgress
                        ? "Your assessment is in progress."
                        : "Your journey is ready to begin."}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">
                  {accessGranted
                    ? "Your personalized Brand DNA has been unlocked. You can explore your profile at any time."
                    : assessmentCompleted
                      ? "Your Brand DNA has been generated. Complete the payment process and wait for verification to unlock it."
                      : assessmentInProgress
                        ? "Continue your assessment from where you stopped."
                        : "Complete the diagnostic assessment to generate your personalized Brand DNA."}
                </p>
              </div>

              <div className="shrink-0">
                {accessGranted ? (
                  <StatusBadge
                    label="Brand DNA Unlocked"
                    variant="success"
                  />
                ) : assessmentCompleted ? (
                  <StatusBadge
                    label="Assessment Completed"
                    variant="success"
                  />
                ) : assessmentInProgress ? (
                  <StatusBadge
                    label="In Progress"
                    variant="neutral"
                  />
                ) : (
                  <StatusBadge
                    label="Not Started"
                    variant="neutral"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            JOURNEY
        ====================================================== */}

        <section>
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Your journey
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Where you are now
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* =================================================
                ASSESSMENT CARD
            ================================================== */}

            <article className="border border-black/10 bg-white p-7 md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                    01
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold">
                    Assessment
                  </h3>
                </div>

                <StatusBadge
                  label={
                    assessmentCompleted
                      ? "Completed"
                      : assessmentInProgress
                        ? "In Progress"
                        : "Not Started"
                  }
                  variant={
                    assessmentCompleted
                      ? "success"
                      : "neutral"
                  }
                />
              </div>

              <p className="mt-5 text-sm leading-7 text-black/55">
                {assessmentCompleted
                  ? "Your assessment has been completed and analyzed. You do not need to take it again."
                  : assessmentInProgress
                    ? "You have already started your assessment. Continue from where you stopped."
                    : "Define your values, archetypes, purpose, vision and voice."}
              </p>

              {/* PROGRESS */}

              {assessmentInProgress && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-black/40">
                      Assessment progress
                    </span>

                    <span className="text-xs font-medium">
                      {assessmentProgress}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-black/10">
                    <div
                      className="h-full bg-[#171519] transition-all"
                      style={{
                        width: `${assessmentProgress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-black/35">
                    Your progress is saved automatically.
                  </p>
                </div>
              )}

              {/* COMPLETED STATE */}

              {assessmentCompleted && (
                <div className="mt-6 border border-black/10 bg-[#F8F5F1] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/45">
                    Assessment complete
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/60">
                    Your answers are securely saved and your
                    Brand DNA has been generated. You do not
                    need to retake the assessment.
                  </p>
                </div>
              )}

              {/* ACTION */}

              <div className="mt-8">
                {assessmentCompleted ? (
                  <Link
                    href="/assessment"
                    className="inline-flex items-center border border-black/15 px-5 py-3 text-sm font-medium transition hover:bg-[#171519] hover:text-white"
                  >
                    Review Assessment

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                ) : assessmentInProgress ? (
                  <Link
                    href="/assessment"
                    className="inline-flex items-center bg-[#171519] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    Continue Assessment

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/assessment"
                    className="inline-flex items-center bg-[#171519] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    Start Assessment

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                )}
              </div>
            </article>

            {/* =================================================
                BRAND DNA CARD
            ================================================== */}

            <article className="border border-black/10 bg-white p-7 md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                    02
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold">
                    Brand DNA
                  </h3>
                </div>

                <StatusBadge
                  label={
                    accessGranted
                      ? "Unlocked"
                      : brandDNAReady
                        ? "Locked"
                        : "Not Ready"
                  }
                  variant={
                    accessGranted
                      ? "success"
                      : "neutral"
                  }
                />
              </div>

              <p className="mt-5 text-sm leading-7 text-black/55">
                {accessGranted
                  ? "Your personalized Brand DNA is ready to explore."
                  : brandDNAReady
                    ? "Your Brand DNA has already been generated. Payment verification is required before you can access it."
                    : "Complete your assessment to generate your personalized Brand DNA."}
              </p>

              {/* PAYMENT STATUS */}

              {brandDNAReady && !accessGranted && (
                <div className="mt-6 border border-black/10 bg-[#F8F5F1] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/45">
                        Payment status
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {payment?.status === "PAID"
                          ? "Payment received — awaiting access approval"
                          : payment?.status === "PENDING"
                            ? "Payment pending verification"
                            : payment?.status === "FAILED"
                              ? "Payment requires attention"
                              : "Payment not completed"}
                      </p>
                    </div>

                    <PaymentStatusBadge
                      status={payment?.status}
                    />
                  </div>
                </div>
              )}

              {/* ACTION */}

              <div className="mt-8">
                {accessGranted ? (
                  <Link
                    href="/results"
                    className="inline-flex items-center bg-[#171519] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    View My Brand DNA

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                ) : brandDNAReady ? (
                  <Link
                    href="/payment"
                    className="inline-flex items-center border border-black/15 px-5 py-3 text-sm font-medium transition hover:bg-[#171519] hover:text-white"
                  >
                    Payment & Unlock

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/assessment"
                    className="inline-flex items-center border border-black/15 px-5 py-3 text-sm font-medium transition hover:bg-[#171519] hover:text-white"
                  >
                    Begin Assessment

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* =====================================================
            NEXT STEP / PAYMENT
        ====================================================== */}

        {assessmentCompleted && !accessGranted && (
          <section className="mt-5">
            <div className="border border-black/10 bg-white p-7 md:p-8">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                    Next step
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Unlock your Brand DNA
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">
                    Your personalized profile has already been
                    generated. You do not need to repeat the
                    assessment. Complete the payment process
                    and send your receipt to the Barandy team
                    for verification.
                  </p>

                  {/* PAYMENT STATE */}

                  {payment?.status === "PENDING" && (
                    <div className="mt-5 inline-flex items-center border border-black/10 bg-[#F8F5F1] px-3 py-2 text-xs uppercase tracking-[0.15em] text-black/50">
                      Payment pending verification
                    </div>
                  )}

                  {payment?.status === "PAID" && (
                    <div className="mt-5 inline-flex items-center border border-black/10 bg-[#F8F5F1] px-3 py-2 text-xs uppercase tracking-[0.15em] text-black/60">
                      Payment received — awaiting admin approval
                    </div>
                  )}

                  {payment?.status === "FAILED" && (
                    <div className="mt-5 inline-flex items-center border border-red-200 bg-red-50 px-3 py-2 text-xs uppercase tracking-[0.15em] text-red-600">
                      Payment requires attention
                    </div>
                  )}
                </div>

                {/* PRICE */}

                <div className="shrink-0">
                  <p className="text-3xl font-semibold">
                    {payment?.amount ?? 100}{" "}
                    <span className="text-base font-normal uppercase">
                      {payment?.currency ?? "TND"}
                    </span>
                  </p>

                  <Link
                    href="/payment"
                    className="mt-4 inline-flex items-center bg-[#171519] px-6 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    View Payment Instructions

                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            UNLOCKED SUCCESS
        ====================================================== */}

        {accessGranted && (
          <section className="mt-5">
            <div className="border border-black/10 bg-[#171519] p-8 text-white md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Your profile is ready
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Your Brand DNA has been unlocked.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                Your personalized brand profile is now
                available. Explore your positioning, voice,
                archetypes, values and strategic direction.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/results"
                  className="inline-flex items-center bg-white px-6 py-3 text-sm font-medium text-[#171519] transition hover:bg-white/90"
                >
                  Explore My Brand DNA

                  <span className="ml-3">
                    →
                  </span>
                </Link>

                <Link
                  href="/assessment"
                  className="inline-flex items-center border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Review Assessment
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="mt-20 flex flex-col justify-between gap-4 border-t border-black/10 pt-8 md:flex-row">
          <p className="text-xs leading-6 text-black/40">
            Barandy — Personal Brand Intelligence
          </p>

          <div className="flex flex-wrap gap-6">
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
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "success" | "neutral";
}) {
  return (
    <span
      className={`border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] ${
        variant === "success"
          ? "border-black/10 bg-[#F8F5F1] text-black/60"
          : "border-black/10 text-black/40"
      }`}
    >
      {variant === "success" && "✓ "}
      {label}
    </span>
  );
}

/* ============================================================
   PAYMENT STATUS
============================================================ */

function PaymentStatusBadge({
  status,
}: {
  status?: string;
}) {
  if (status === "PAID") {
    return (
      <span className="border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-black/60">
        Paid
      </span>
    );
  }

  if (status === "PENDING") {
    return (
      <span className="border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-black/45">
        Pending
      </span>
    );
  }

  if (status === "FAILED") {
    return (
      <span className="border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-red-600">
        Failed
      </span>
    );
  }

  return (
    <span className="border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
      Not paid
    </span>
  );
}

