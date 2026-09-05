
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage(): Promise<React.ReactNode> {
  // --------------------------------------------------
  // 1. Check authentication
  // --------------------------------------------------

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // --------------------------------------------------
  // 2. Get current user and verify admin role
  // --------------------------------------------------

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
      firstName: true,
      lastName: true,
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
  // 3. Fetch dashboard statistics
  // --------------------------------------------------

  const [
    totalClients,
    completedAssessments,
    pendingVerification,
    unlockedClients,
  ] = await Promise.all([
    // Total registered clients
    prisma.user.count({
      where: {
        role: "CLIENT",
      },
    }),

    // Completed assessments
    prisma.assessment.count({
      where: {
        status: "COMPLETED",
      },
    }),

    // Clients who completed the assessment
    // but haven't been granted access yet
    prisma.user.count({
      where: {
        role: "CLIENT",
        accessGranted: false,
        assessments: {
          some: {
            status: "COMPLETED",
          },
        },
      },
    }),

    // Clients whose Brand DNA has been unlocked
    prisma.user.count({
      where: {
        role: "CLIENT",
        accessGranted: true,
      },
    }),
  ]);

  // --------------------------------------------------
  // 4. Format admin name
  // --------------------------------------------------

  const adminName =
    [currentUser.firstName, currentUser.lastName]
      .filter(Boolean)
      .join(" ") || "Admin";

  // --------------------------------------------------
  // 5. Dashboard UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">

        {/* ================================================
            HEADER
        ================================================= */}

        <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em]">
              BARANDY
            </p>

            <p className="mt-2 text-xs text-black/45">
              Personal Brand Intelligence
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Admin
            </p>

            <p className="mt-1 text-sm font-medium">
              {adminName}
            </p>
          </div>
        </header>

        {/* ================================================
            HERO
        ================================================= */}

        <section className="mt-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
            Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Welcome back.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">
            Manage clients, verify payments, and monitor the
            Barandy Personal Brand Intelligence platform.
          </p>
        </section>

        {/* ================================================
            STATISTICS
        ================================================= */}

        <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Clients */}

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Total clients
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {totalClients}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Registered clients
            </p>
          </article>

          {/* Completed Assessments */}

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Assessments
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {completedAssessments}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Completed assessments
            </p>
          </article>

          {/* Pending Verification */}

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Pending
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {pendingVerification}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Awaiting verification
            </p>
          </article>

          {/* Unlocked */}

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Unlocked
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {unlockedClients}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Brand DNA unlocked
            </p>
          </article>

        </section>

        {/* ================================================
            MANAGEMENT
        ================================================= */}

        <section className="mt-16">

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Management
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Platform management.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* --------------------------------------------
                PAYMENT VERIFICATION
            --------------------------------------------- */}

            <Link
              href="/admin/pending"
              className="group border border-black/10 bg-white p-8 transition hover:border-black/25"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  01
                </span>

                <span className="text-black/30 transition group-hover:translate-x-1 group-hover:text-black">
                  →
                </span>
              </div>

              <h3 className="mt-10 text-xl font-semibold tracking-tight">
                Payment verification
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Review completed assessments and verify client
                payments before unlocking Brand DNA.
              </p>

              <div className="mt-8 border-t border-black/10 pt-5">
                <span className="text-sm font-medium">
                  {pendingVerification} pending
                </span>
              </div>
            </Link>

            {/* --------------------------------------------
                CLIENTS
            --------------------------------------------- */}

            <Link
              href="/admin/clients"
              className="group border border-black/10 bg-white p-8 transition hover:border-black/25"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  02
                </span>

                <span className="text-black/30 transition group-hover:translate-x-1 group-hover:text-black">
                  →
                </span>
              </div>

              <h3 className="mt-10 text-xl font-semibold tracking-tight">
                Clients
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                View registered clients, their assessment status,
                and Brand DNA access.
              </p>

              <div className="mt-8 border-t border-black/10 pt-5">
                <span className="text-sm font-medium">
                  {totalClients} clients
                </span>
              </div>
            </Link>

            {/* --------------------------------------------
                ANALYTICS
            --------------------------------------------- */}

            <Link
              href="/admin/analytics"
              className="group border border-black/10 bg-white p-8 transition hover:border-black/25"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  03
                </span>

                <span className="text-black/30 transition group-hover:translate-x-1 group-hover:text-black">
                  →
                </span>
              </div>

              <h3 className="mt-10 text-xl font-semibold tracking-tight">
                Analytics
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Monitor assessment completion, payments, and
                overall platform activity.
              </p>

              <div className="mt-8 border-t border-black/10 pt-5">
                <span className="text-sm font-medium">
                  View platform insights
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* ================================================
            CURRENT STATUS
        ================================================= */}

        <section className="mt-16">

          <div className="border border-black/10 bg-[#171519] p-8 text-white md:p-10">

            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                  Current status
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                  {pendingVerification > 0
                    ? `${pendingVerification} client${
                        pendingVerification > 1
                          ? "s"
                          : ""
                      } waiting for verification.`
                    : "Everything is up to date."}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
                  {pendingVerification > 0
                    ? "Review the pending payments and unlock Brand DNA once each payment has been verified."
                    : "There are currently no completed assessments waiting for payment verification."}
                </p>

              </div>

              {pendingVerification > 0 && (
                <Link
                  href="/admin/pending"
                  className="shrink-0 bg-white px-6 py-4 text-center text-sm font-medium text-[#171519] transition hover:bg-white/90"
                >
                  Review pending payments
                </Link>
              )}

            </div>

          </div>

        </section>

        {/* ================================================
            FOOTER
        ================================================= */}

        <footer className="mt-16 border-t border-black/10 pt-8">

          <div className="flex flex-col gap-3 text-xs text-black/40 md:flex-row md:items-center md:justify-between">

            <p>
              Barandy Admin · Personal Brand Intelligence
            </p>

            <p>
              Role: {currentUser.role}
            </p>

          </div>

        </footer>

      </div>
    </main>
  );
}

