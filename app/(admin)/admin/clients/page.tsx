
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage(): Promise<React.ReactNode> {
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
  // 3. Fetch clients
  // --------------------------------------------------

  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      accessGranted: true,
      createdAt: true,

      assessments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          status: true,
          progress: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  // --------------------------------------------------
  // 4. Helpers
  // --------------------------------------------------

  const formatName = (
    firstName: string | null,
    lastName: string | null,
    email: string
  ) => {
    const name = [firstName, lastName]
      .filter(Boolean)
      .join(" ");

    return name || email;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getAssessmentLabel = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completed";
      case "IN_PROGRESS":
        return "In progress";
      default:
        return "Not started";
    }
  };

  const getPaymentLabel = (status?: string) => {
    switch (status) {
      case "PAID":
        return "Paid";
      case "PENDING":
        return "Pending";
      case "FAILED":
        return "Failed";
      case "REFUNDED":
        return "Refunded";
      default:
        return "No payment";
    }
  };

  // --------------------------------------------------
  // 5. Statistics
  // --------------------------------------------------

  const completedCount = clients.filter(
    (client) =>
      client.assessments[0]?.status === "COMPLETED"
  ).length;

  const pendingCount = clients.filter(
    (client) =>
      client.payments[0]?.status === "PENDING"
  ).length;

  const unlockedCount = clients.filter(
    (client) => client.accessGranted
  ).length;

  // --------------------------------------------------
  // 6. UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">

        {/* HEADER */}

        <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-[0.25em] hover:opacity-60"
            >
              BARANDY
            </Link>

            <p className="mt-2 text-xs text-black/45">
              Personal Brand Intelligence · Admin
            </p>
          </div>

          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.2em] text-black/45 transition hover:text-black"
          >
            ← Dashboard
          </Link>
        </header>

        {/* HERO */}

        <section className="mt-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
            Client management
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Clients.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">
            View registered clients, assessment progress, payment
            status, and Brand DNA access.
          </p>
        </section>

        {/* STATISTICS */}

        <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Total clients
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {clients.length}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Registered clients
            </p>
          </article>

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Assessments
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {completedCount}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Completed
            </p>
          </article>

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Pending
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {pendingCount}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Payments to review
            </p>
          </article>

          <article className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-black/40">
              Unlocked
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {unlockedCount}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Brand DNA access
            </p>
          </article>

        </section>

        {/* CLIENT LIST */}

        <section className="mt-16">

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Directory
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              All clients.
            </h2>
          </div>

          {clients.length === 0 ? (
            <div className="border border-black/10 bg-white p-10">
              <p className="text-sm text-black/50">
                No clients have registered yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {clients.map((client) => {
                const assessment = client.assessments[0];
                const payment = client.payments[0];

                const clientName = formatName(
                  client.firstName,
                  client.lastName,
                  client.email
                );

                return (
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="group block border border-black/10 bg-white p-6 transition hover:border-black/25 md:p-8"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                      {/* CLIENT */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold tracking-tight">
                            {clientName}
                          </h3>

                          {client.accessGranted ? (
                            <span className="border border-black/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]">
                              Unlocked
                            </span>
                          ) : (
                            <span className="border border-black/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-black/45">
                              Locked
                            </span>
                          )}

                        </div>

                        <p className="mt-2 truncate text-sm text-black/45">
                          {client.email}
                        </p>

                        <p className="mt-3 text-xs text-black/35">
                          Joined {formatDate(client.createdAt)}
                        </p>

                      </div>

                      {/* STATUS */}

                      <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-5 sm:grid-cols-3 lg:border-t-0 lg:pt-0">

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-black/35">
                            Assessment
                          </p>

                          <p className="mt-2 text-sm font-medium">
                            {getAssessmentLabel(
                              assessment?.status
                            )}
                          </p>

                          {assessment?.status ===
                            "IN_PROGRESS" && (
                            <p className="mt-1 text-xs text-black/40">
                              {assessment.progress}% complete
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-black/35">
                            Payment
                          </p>

                          <p className="mt-2 text-sm font-medium">
                            {getPaymentLabel(
                              payment?.status
                            )}
                          </p>

                          {payment && (
                            <p className="mt-1 text-xs text-black/40">
                              {payment.amount}{" "}
                              {payment.currency.toUpperCase()}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-black/35">
                            Access
                          </p>

                          <p className="mt-2 text-sm font-medium">
                            {client.accessGranted
                              ? "Brand DNA unlocked"
                              : "Not unlocked"}
                          </p>
                        </div>

                      </div>

                      {/* ARROW */}

                      <div className="hidden shrink-0 text-xl text-black/25 transition group-hover:translate-x-1 group-hover:text-black lg:block">
                        →
                      </div>

                    </div>
                  </Link>
                );
              })}

            </div>
          )}

        </section>

        {/* FOOTER */}

        <footer className="mt-16 border-t border-black/10 pt-8">

          <div className="flex flex-col gap-3 text-xs text-black/40 md:flex-row md:items-center md:justify-between">

            <p>
              Barandy Admin · Client Management
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

