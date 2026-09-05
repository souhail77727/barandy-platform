import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import UnlockButton from "../../pending/UnlockButton";

type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Answers = {
  personName?: string;
  selectedValues?: string[];
  primaryArchetypeId?: string;
  secondaryArchetypeId?: string;
  purpose?: string;
  vision?: string;
  ikigai?: {
    passion?: string;
    mission?: string;
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
  selectedTones?: string[];
};

type ContentPillar =
  | string
  | {
      title?: string;
      description?: string;
    };

type BrandDNA = {
  voice?: {
    tone?: string[];
    style?: string;
  };

  values?: string[];

  primaryArchetype?: {
    id?: string;
    title?: string;
    motto?: string;
    dominance?: number;
    shadow?: string;
  };

  secondaryArchetype?: {
    id?: string;
    title?: string;
    motto?: string;
    dominance?: number;
    shadow?: string;
  };

  purpose?: string;
  vision?: string;
  personName?: string;
  elevatorPitch?: string;
  executivePositioning?: string;
  strategicManifesto?: string;

  strategicAdvices?: string[];

  contentPillars?: ContentPillar[];

  colorPalette?: {
    accent?: string;
    primary?: string;
    secondary?: string;
    darkNeutral?: string;
    lightNeutral?: string;
  };
};

export default async function AdminClientDetailPage({
  params,
}: ClientPageProps): Promise<React.ReactNode> {
  // --------------------------------------------------
  // 1. Authentication
  // --------------------------------------------------

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // --------------------------------------------------
  // 2. Verify admin role
  // --------------------------------------------------

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (
    !currentUser ||
    (currentUser.role !== "ADMIN" &&
      currentUser.role !== "DEVELOPER")
  ) {
    redirect("/");
  }

  // --------------------------------------------------
  // 3. Get client ID
  // --------------------------------------------------

  const { id } = await params;

  // --------------------------------------------------
  // 4. Fetch client
  // --------------------------------------------------

  const client = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      accessGranted: true,
      createdAt: true,
      updatedAt: true,

      assessments: {
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          status: true,
          progress: true,
          answers: true,
          startedAt: true,
          createdAt: true,
          updatedAt: true,

          result: {
            select: {
              id: true,
              brandDNA: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          stripePaymentId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!client || client.role !== "CLIENT") {
    notFound();
  }

  // --------------------------------------------------
  // 5. Prepare data
  // --------------------------------------------------

  const fullName =
    [client.firstName, client.lastName]
      .filter(Boolean)
      .join(" ") || "Unnamed Client";

  const latestAssessment = client.assessments[0];
  const latestPayment = client.payments[0];

  const answers: Answers =
    latestAssessment?.answers &&
    typeof latestAssessment.answers === "object" &&
    !Array.isArray(latestAssessment.answers)
      ? (latestAssessment.answers as Answers)
      : {};

  const brandDNA: BrandDNA =
    latestAssessment?.result?.brandDNA &&
    typeof latestAssessment.result.brandDNA === "object" &&
    !Array.isArray(latestAssessment.result.brandDNA)
      ? (latestAssessment.result.brandDNA as BrandDNA)
      : {};

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const assessmentCompleted =
    latestAssessment?.status === "COMPLETED";

  const paymentPending =
    latestPayment?.status === "PENDING";

  const paymentPaid =
    latestPayment?.status === "PAID";

  const canUnlock =
    !client.accessGranted &&
    assessmentCompleted &&
    paymentPending;

  const totalAssessmentSteps = 8;

  const completedAssessmentSteps = Math.min(
    Math.max(latestAssessment?.progress ?? 0, 0),
    totalAssessmentSteps
  );

  const assessmentPercentage = Math.round(
    (completedAssessmentSteps / totalAssessmentSteps) * 100
  );

  const formatArchetype = (id?: string) => {
    if (!id) return "—";

    const labels: Record<string, string> = {
      visionary: "The Magician / Visionary",
      ruler: "The Ruler",
      creator: "The Creator",
      sage: "The Sage",
      explorer: "The Explorer",
      hero: "The Hero",
      caregiver: "The Caregiver",
      everyman: "The Everyman",
      jester: "The Jester",
      lover: "The Lover",
      innocent: "The Innocent",
      outlaw: "The Outlaw",
    };

    return labels[id.toLowerCase()] || id;
  };

  const formatValueLabel = (value: string) => {
    return value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-12">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="flex flex-col gap-5 border-b border-black/10 pb-7 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-[0.25em] transition hover:opacity-60"
            >
              BARANDY
            </Link>

            <p className="mt-2 text-xs text-black/40">
              Client review
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs uppercase tracking-[0.15em]">
            <Link
              href="/admin/clients"
              className="text-black/45 transition hover:text-black"
            >
              ← All clients
            </Link>

            <Link
              href="/admin/pending"
              className="text-black/45 transition hover:text-black"
            >
              Pending payments
            </Link>
          </div>
        </header>

        {/* ==================================================
            CLIENT HEADER
        ================================================== */}

        <section className="mt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/40">
                Client profile
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                {fullName}
              </h1>

              <p className="mt-3 text-sm text-black/50">
                {client.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {client.accessGranted ? (
                <span className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.12em]">
                  <span className="h-2 w-2 rounded-full bg-black" />
                  Brand DNA unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                  <span className="h-2 w-2 rounded-full bg-black/20" />
                  Brand DNA locked
                </span>
              )}

              {latestAssessment && (
                <span className="border border-black/10 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.12em]">
                  {assessmentCompleted
                    ? "Assessment completed"
                    : "Assessment in progress"}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            QUICK OVERVIEW
        ================================================== */}

        <section className="mt-10 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
          <div className="bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/35">
              Assessment
            </p>

            <p className="mt-4 text-2xl font-semibold">
              {assessmentCompleted
                ? "Completed"
                : latestAssessment
                  ? "In progress"
                  : "Not started"}
            </p>

            {latestAssessment && (
              <p className="mt-2 text-sm text-black/45">
                {completedAssessmentSteps} of{" "}
                {totalAssessmentSteps} sections completed
              </p>
            )}
          </div>

          <div className="bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/35">
              Payment
            </p>

            <p className="mt-4 text-2xl font-semibold">
              {latestPayment
                ? `${latestPayment.amount} ${latestPayment.currency.toUpperCase()}`
                : "No payment"}
            </p>

            <p className="mt-2 text-sm text-black/45">
              {latestPayment?.status === "PENDING"
                ? "Waiting for verification"
                : latestPayment?.status === "PAID"
                  ? "Payment verified"
                  : latestPayment
                    ? latestPayment.status
                    : "No payment submitted"}
            </p>
          </div>

          <div className="bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/35">
              Access
            </p>

            <p className="mt-4 text-2xl font-semibold">
              {client.accessGranted
                ? "Granted"
                : "Not granted"}
            </p>

            <p className="mt-2 text-sm text-black/45">
              {client.accessGranted
                ? "Client can access their Brand DNA"
                : "Access is currently locked"}
            </p>
          </div>
        </section>

        {/* ==================================================
            PAYMENT VERIFICATION
        ================================================== */}

        {canUnlock && latestPayment && (
          <section className="mt-10">
            <div className="border border-black/15 bg-white">

              <div className="border-b border-black/10 px-7 py-6 md:px-9">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  Action required
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Verify this payment
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
                  The client has completed their assessment and submitted
                  a payment. Check the payment receipt before confirming
                  access to their Brand DNA.
                </p>
              </div>

              <div className="grid md:grid-cols-[1fr_auto]">

                <div className="grid gap-6 p-7 sm:grid-cols-3 md:p-9">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Amount
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      {latestPayment.amount}{" "}
                      {latestPayment.currency.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Payment status
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      Pending verification
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Submitted
                    </p>

                    <p className="mt-2 text-sm">
                      {formatDate(latestPayment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center border-t border-black/10 p-7 md:border-l md:border-t-0 md:p-9">
                  <div className="w-full md:min-w-[270px]">

                    <p className="mb-4 text-xs leading-5 text-black/40">
                      Only confirm after you have checked the client&apos;s
                      payment receipt.
                    </p>

                    <UnlockButton
                      userId={client.id}
                      clientName={fullName}
                    />

                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            VERIFIED PAYMENT
        ================================================== */}

        {client.accessGranted && paymentPaid && (
          <section className="mt-10">
            <div className="border border-black/10 bg-white p-7 md:p-9">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-[#F8F5F1]">
                    <span className="text-sm">
                      ✓
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/40">
                      Payment verified
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      Brand DNA access is unlocked.
                    </h2>

                    <p className="mt-2 text-sm text-black/45">
                      This client has completed payment verification.
                    </p>
                  </div>

                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Amount
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {latestPayment?.amount}{" "}
                    {latestPayment?.currency.toUpperCase()}
                  </p>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            ASSESSMENT RESPONSES
        ================================================== */}

        <section className="mt-16">

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Assessment
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Client responses
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
              A readable summary of what the client shared during the
              Brand DNA assessment.
            </p>
          </div>

          {!latestAssessment ? (
            <div className="border border-black/10 bg-white p-8">
              <p className="text-sm text-black/50">
                This client has not started an assessment yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* ------------------------------------------
                  STATUS
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                      Assessment status
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      {assessmentCompleted
                        ? "Completed"
                        : latestAssessment.status === "IN_PROGRESS"
                          ? "In progress"
                          : "Not started"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                      Progress
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      {completedAssessmentSteps} /{" "}
                      {totalAssessmentSteps}
                    </p>
                  </div>

                </div>

                <div className="mt-6 h-1.5 overflow-hidden bg-black/5">
                  <div
                    className="h-full bg-[#171519] transition-all"
                    style={{
                      width: `${assessmentPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-xs text-black/35">
                  Last updated{" "}
                  {formatDate(latestAssessment.updatedAt)}
                </p>

              </div>

              {/* ------------------------------------------
                  IDENTITY
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  01 · Identity
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Who is the brand?
                </h3>

                <div className="mt-7">
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Person / brand name
                  </p>

                  <p className="mt-2 text-lg">
                    {answers.personName || fullName}
                  </p>
                </div>

              </div>

              {/* ------------------------------------------
                  VALUES
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  02 · Values
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  What matters most?
                </h3>

                <div className="mt-6 flex flex-wrap gap-2">

                  {answers.selectedValues?.length ? (
                    answers.selectedValues.map((value) => (
                      <span
                        key={value}
                        className="border border-black/10 bg-[#F8F5F1] px-4 py-2 text-sm"
                      >
                        {formatValueLabel(value)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-black/40">
                      No values selected.
                    </p>
                  )}

                </div>
              </div>

              {/* ------------------------------------------
                  ARCHETYPES
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  03 · Archetypes
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Brand personality
                </h3>

                <div className="mt-7 grid gap-5 md:grid-cols-2">

                  <div className="border border-black/10 bg-[#F8F5F1] p-6">
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Primary archetype
                    </p>

                    <p className="mt-3 text-lg font-semibold">
                      {formatArchetype(
                        answers.primaryArchetypeId
                      )}
                    </p>
                  </div>

                  <div className="border border-black/10 bg-[#F8F5F1] p-6">
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Secondary archetype
                    </p>

                    <p className="mt-3 text-lg font-semibold">
                      {formatArchetype(
                        answers.secondaryArchetypeId
                      )}
                    </p>
                  </div>

                </div>
              </div>

              {/* ------------------------------------------
                  PURPOSE + VISION
              ------------------------------------------ */}

              <div className="grid gap-5 md:grid-cols-2">

                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    04 · Purpose
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Why does the brand exist?
                  </h3>

                  <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-black/65">
                    {answers.purpose ||
                      "No response provided."}
                  </p>

                </div>

                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    05 · Vision
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Where is the brand going?
                  </h3>

                  <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-black/65">
                    {answers.vision ||
                      "No response provided."}
                  </p>

                </div>

              </div>

              {/* ------------------------------------------
                  IKIGAI
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  06 · Ikigai
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Personal alignment
                </h3>

                <div className="mt-7 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">

                  <IkigaiItem
                    label="Passion"
                    value={answers.ikigai?.passion}
                  />

                  <IkigaiItem
                    label="Mission"
                    value={answers.ikigai?.mission}
                  />

                  <IkigaiItem
                    label="Vocation"
                    value={answers.ikigai?.vocation}
                  />

                  <IkigaiItem
                    label="Profession"
                    value={answers.ikigai?.profession}
                  />

                  <div className="bg-[#F8F5F1] p-6 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Intersection
                    </p>

                    <p className="mt-3 text-sm leading-6">
                      {answers.ikigai?.intersection || "—"}
                    </p>
                  </div>

                </div>
              </div>

              {/* ------------------------------------------
                  PERCEPTION
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  07 · Brand perception
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  How should the brand be perceived?
                </h3>

                <div className="mt-8 space-y-7">

                  <PerceptionBar
                    left="Specialist"
                    right="Polymath"
                    value={
                      answers.perception
                        ?.specialistVsPolymath
                    }
                  />

                  <PerceptionBar
                    left="Innovation"
                    right="Tradition"
                    value={
                      answers.perception
                        ?.innovationVsTradition
                    }
                  />

                  <PerceptionBar
                    left="Provocative"
                    right="Reassuring"
                    value={
                      answers.perception
                        ?.provocativeVsReassuring
                    }
                  />

                  <PerceptionBar
                    left="Authority"
                    right="Accessibility"
                    value={
                      answers.perception
                        ?.authorityVsAccessibility
                    }
                  />

                </div>
              </div>

              {/* ------------------------------------------
                  VOICE
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  08 · Voice
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  How should the brand communicate?
                </h3>

                <div className="mt-6 flex flex-wrap gap-2">

                  {answers.selectedTones?.length ? (
                    answers.selectedTones.map((tone) => (
                      <span
                        key={tone}
                        className="border border-black/10 bg-[#F8F5F1] px-4 py-2 text-sm"
                      >
                        {tone}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-black/40">
                      No communication tones selected.
                    </p>
                  )}

                </div>
              </div>

            </div>
          )}
        </section>

        {/* ==================================================
            BRAND DNA
        ================================================== */}

        <section className="mt-20">

          <div className="mb-8">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Brand DNA
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Generated brand profile
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
              The strategic profile generated from the client&apos;s
              assessment.
            </p>

          </div>

          {!latestAssessment?.result ? (
            <div className="border border-black/10 bg-white p-8">
              <p className="text-sm text-black/50">
                The Brand DNA has not been generated yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* ------------------------------------------
                  BRAND OVERVIEW
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                      Brand identity
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                      {brandDNA.personName || fullName}
                    </h3>

                    {brandDNA.primaryArchetype?.title && (
                      <p className="mt-3 text-sm text-black/50">
                        {brandDNA.primaryArchetype.title}
                      </p>
                    )}
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                      Generated
                    </p>

                    <p className="mt-2 text-sm">
                      {formatDate(
                        latestAssessment.result.createdAt
                      )}
                    </p>
                  </div>

                </div>

                {brandDNA.elevatorPitch && (
                  <div className="mt-8 border-l-2 border-black/15 pl-5">

                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Elevator pitch
                    </p>

                    <p className="mt-3 text-lg leading-8 text-black/75">
                      {brandDNA.elevatorPitch}
                    </p>

                  </div>
                )}

              </div>

              {/* ------------------------------------------
                  VOICE + VALUES
              ------------------------------------------ */}

              <div className="grid gap-5 md:grid-cols-2">

                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Voice
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Communication style
                  </h3>

                  {brandDNA.voice?.tone?.length ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {brandDNA.voice.tone.map((tone) => (
                        <span
                          key={tone}
                          className="border border-black/10 bg-[#F8F5F1] px-3 py-2 text-sm"
                        >
                          {tone}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {brandDNA.voice?.style && (
                    <p className="mt-6 text-sm leading-7 text-black/60">
                      {brandDNA.voice.style}
                    </p>
                  )}

                </div>

                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Values
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Core principles
                  </h3>

                  <div className="mt-6 space-y-3">

                    {brandDNA.values?.length ? (
                      brandDNA.values.map((value) => (
                        <div
                          key={value}
                          className="flex items-center gap-3"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#171519]" />

                          <span className="text-sm">
                            {formatValueLabel(value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-black/40">
                        No values available.
                      </p>
                    )}

                  </div>
                </div>

              </div>

              {/* ------------------------------------------
                  ARCHETYPES
              ------------------------------------------ */}

              <div className="border border-black/10 bg-white p-7 md:p-9">

                <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                  Archetypes
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Brand personality
                </h3>

                <div className="mt-7 grid gap-5 md:grid-cols-2">

                  {brandDNA.primaryArchetype && (
                    <ArchetypeCard
                      label="Primary"
                      archetype={brandDNA.primaryArchetype}
                    />
                  )}

                  {brandDNA.secondaryArchetype && (
                    <ArchetypeCard
                      label="Secondary"
                      archetype={brandDNA.secondaryArchetype}
                    />
                  )}

                </div>
              </div>

              {/* ------------------------------------------
                  PURPOSE + VISION
              ------------------------------------------ */}

              <div className="grid gap-5 md:grid-cols-2">

                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Purpose
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Why this brand exists
                  </h3>

                  <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-black/60">
                    {brandDNA.purpose || "—"}
                  </p>

                </div>

                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Vision
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Where the brand is going
                  </h3>

                  <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-black/60">
                    {brandDNA.vision || "—"}
                  </p>

                </div>

              </div>

              {/* ------------------------------------------
                  EXECUTIVE POSITIONING
              ------------------------------------------ */}

              {brandDNA.executivePositioning && (
                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Executive positioning
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Strategic positioning
                  </h3>

                  <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-black/65">
                    {brandDNA.executivePositioning}
                  </p>

                </div>
              )}

              {/* ------------------------------------------
                  STRATEGIC MANIFESTO
              ------------------------------------------ */}

              {brandDNA.strategicManifesto && (
                <div className="border border-black/10 bg-[#171519] p-8 text-white md:p-10">

                  <p className="text-xs uppercase tracking-[0.15em] text-white/45">
                    Strategic manifesto
                  </p>

                  <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-white/85">
                    {brandDNA.strategicManifesto}
                  </p>

                </div>
              )}

              {/* ------------------------------------------
                  STRATEGIC ADVICE
              ------------------------------------------ */}

              {brandDNA.strategicAdvices?.length ? (
                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Strategic advice
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Recommended direction
                  </h3>

                  <div className="mt-7 space-y-4">

                    {brandDNA.strategicAdvices.map(
                      (advice, index) => (
                        <div
                          key={`${index}-${advice}`}
                          className="flex gap-4 border-b border-black/10 pb-4 last:border-0 last:pb-0"
                        >
                          <span className="text-xs font-medium text-black/35">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <p className="text-sm leading-7 text-black/65">
                            {advice}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                </div>
              ) : null}

              {/* ------------------------------------------
                  CONTENT PILLARS
              ------------------------------------------ */}

              {brandDNA.contentPillars?.length ? (
                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Content pillars
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Key themes
                  </h3>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">

                    {brandDNA.contentPillars.map(
                      (pillar, index) => {
                        const item =
                          typeof pillar === "object" &&
                          pillar !== null
                            ? pillar
                            : {
                                title: String(pillar),
                                description: "",
                              };

                        return (
                          <div
                            key={`${index}-${item.title || "pillar"}`}
                            className="border border-black/10 bg-[#F8F5F1] p-5"
                          >
                            <span className="text-xs text-black/35">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <p className="mt-2 text-sm font-medium">
                              {item.title || "Content pillar"}
                            </p>

                            {item.description && (
                              <p className="mt-2 text-sm leading-6 text-black/55">
                                {item.description}
                              </p>
                            )}
                          </div>
                        );
                      }
                    )}

                  </div>
                </div>
              ) : null}

              {/* ------------------------------------------
                  COLOR PALETTE
              ------------------------------------------ */}

              {brandDNA.colorPalette && (
                <div className="border border-black/10 bg-white p-7 md:p-9">

                  <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                    Visual direction
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Color palette
                  </h3>

                  <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">

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
                      label="Dark"
                      value={brandDNA.colorPalette.darkNeutral}
                    />

                    <ColorSwatch
                      label="Light"
                      value={brandDNA.colorPalette.lightNeutral}
                    />

                  </div>
                </div>
              )}

            </div>
          )}
        </section>

        {/* ==================================================
            PAYMENT HISTORY
        ================================================== */}

        <section className="mt-20">

          <div className="mb-8">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Payment history
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Payments
            </h2>

            <p className="mt-2 text-sm text-black/45">
              Previous payment records for this client.
            </p>

          </div>

          {client.payments.length === 0 ? (
            <div className="border border-black/10 bg-white p-8">
              <p className="text-sm text-black/50">
                No payments recorded for this client.
              </p>
            </div>
          ) : (
            <div className="space-y-3">

              {client.payments.map((payment) => {
                const isPaid = payment.status === "PAID";
                const isPending =
                  payment.status === "PENDING";

                return (
                  <div
                    key={payment.id}
                    className="border border-black/10 bg-white p-6 md:p-7"
                  >

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div>
                        <p className="text-lg font-semibold">
                          {payment.amount}{" "}
                          {payment.currency.toUpperCase()}
                        </p>

                        <p className="mt-1 text-sm text-black/45">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`self-start px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] ${
                          isPaid
                            ? "bg-black text-white"
                            : isPending
                              ? "border border-black/10 bg-[#F8F5F1] text-black/60"
                              : "border border-black/10 bg-white text-black/45"
                        }`}
                      >
                        {payment.status === "PAID"
                          ? "Verified"
                          : payment.status === "PENDING"
                            ? "Pending"
                            : payment.status}
                      </span>

                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </section>

        {/* ==================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <section className="mt-20">

          <div className="mb-8">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Account
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Account information
            </h2>

          </div>

          <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">

            <InfoCard
              label="Client"
              value={fullName}
            />

            <InfoCard
              label="Email"
              value={client.email}
            />

            <InfoCard
              label="Registered"
              value={formatDate(client.createdAt)}
            />

            <InfoCard
              label="Last updated"
              value={formatDate(client.updatedAt)}
            />

            <InfoCard
              label="Brand DNA access"
              value={
                client.accessGranted
                  ? "Granted"
                  : "Not granted"
              }
            />

            <InfoCard
              label="Assessment records"
              value={String(client.assessments.length)}
            />

          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="mt-16 border-t border-black/10 pt-7">

          <div className="flex flex-col gap-3 text-xs text-black/35 sm:flex-row sm:items-center sm:justify-between">

            <p>
              Barandy Admin · Client Review
            </p>

            <p>
              {currentUser.role === "DEVELOPER"
                ? "Developer access"
                : "Administrator access"}
            </p>

          </div>

        </footer>

      </div>
    </main>
  );
}

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 md:p-7">

      <p className="text-xs uppercase tracking-[0.12em] text-black/35">
        {label}
      </p>

      <p className="mt-3 break-words text-sm font-medium">
        {value}
      </p>

    </div>
  );
}

function IkigaiItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="bg-[#F8F5F1] p-6">

      <p className="text-xs uppercase tracking-[0.12em] text-black/35">
        {label}
      </p>

      <p className="mt-3 text-sm leading-6">
        {value || "—"}
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

      <div className="flex items-center justify-between gap-4 text-xs">

        <span className="text-black/50">
          {left}
        </span>

        <span className="font-medium text-black/60">
          {safeValue}%
        </span>

        <span className="text-right text-black/50">
          {right}
        </span>

      </div>

      <div className="relative mt-3 h-2 bg-black/5">

        <div
          className="absolute left-0 top-0 h-full bg-black/15"
          style={{
            width: `${safeValue}%`,
          }}
        />

        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#171519] shadow-sm"
          style={{
            left: `calc(${safeValue}% - 8px)`,
          }}
        />

      </div>
    </div>
  );
}

function ArchetypeCard({
  label,
  archetype,
}: {
  label: string;
  archetype: {
    title?: string;
    motto?: string;
    dominance?: number;
    shadow?: string;
  };
}) {
  return (
    <div className="border border-black/10 bg-[#F8F5F1] p-6">

      <p className="text-xs uppercase tracking-[0.12em] text-black/35">
        {label}
      </p>

      <h4 className="mt-3 text-lg font-semibold">
        {archetype.title || "—"}
      </h4>

      {archetype.motto && (
        <p className="mt-3 text-sm italic leading-6 text-black/55">
          “{archetype.motto}”
        </p>
      )}

      {typeof archetype.dominance === "number" && (
        <div className="mt-5">

          <div className="flex justify-between text-xs text-black/40">
            <span>Influence</span>
            <span>
              {archetype.dominance}%
            </span>
          </div>

          <div className="mt-2 h-1.5 bg-black/10">

            <div
              className="h-full bg-[#171519]"
              style={{
                width: `${Math.min(
                  Math.max(archetype.dominance, 0),
                  100
                )}%`,
              }}
            />

          </div>
        </div>
      )}

      {archetype.shadow && (
        <div className="mt-5 border-t border-black/10 pt-4">

          <p className="text-xs uppercase tracking-[0.1em] text-black/35">
            Watch out for
          </p>

          <p className="mt-2 text-sm leading-6 text-black/55">
            {archetype.shadow}
          </p>

        </div>
      )}

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
    return (
      <div className="border border-black/10 bg-[#F8F5F1] p-4">

        <p className="text-xs uppercase tracking-[0.1em] text-black/35">
          {label}
        </p>

        <p className="mt-3 text-xs text-black/40">
          —
        </p>

      </div>
    );
  }

  return (
    <div className="border border-black/10 bg-white p-3">

      <div
        className="h-16 w-full border border-black/10"
        style={{
          backgroundColor: value,
        }}
      />

      <p className="mt-3 text-xs uppercase tracking-[0.1em] text-black/35">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium">
        {value}
      </p>

    </div>
  );
}

