import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import UnlockButton from "./UnlockButton";

export default async function PendingPaymentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

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

  const pendingClients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
      accessGranted: false,
      assessments: {
        some: {
          status: "COMPLETED",
        },
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      assessments: {
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
          status: true,
          updatedAt: true,
          result: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
        {/* Header */}
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
              Payment Verification
            </p>
          </div>
        </header>

        {/* Page intro */}
        <section className="mt-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
                Pending payments
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                Verify & unlock.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">
                Review clients who have completed their assessment
                and are waiting for payment verification.
              </p>
            </div>

            <div className="border border-black/10 bg-white px-6 py-5">
              <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                Awaiting verification
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {pendingClients.length}
              </p>
            </div>
          </div>
        </section>

        {/* Pending clients */}
        <section className="mt-12">
          {pendingClients.length === 0 ? (
            <div className="border border-black/10 bg-white px-8 py-16 text-center">
              <p className="text-lg font-medium">
                No pending payments.
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">
                All completed assessments have either been verified
                or there are currently no clients waiting for
                payment verification.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {pendingClients.map((client) => {
                const assessment = client.assessments[0];

                const fullName =
                  [client.firstName, client.lastName]
                    .filter(Boolean)
                    .join(" ") || "Unnamed Client";

                return (
                  <article
                    key={client.id}
                    className="border border-black/10 bg-white p-7 md:p-9"
                  >
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                      {/* Client information */}
                      <div className="min-w-0">
                        <div className="flex items-start gap-5">
                          <span className="text-xs font-medium uppercase tracking-[0.15em] text-black/35">
                            Client
                          </span>

                          <div className="min-w-0">
                            <h2 className="text-xl font-semibold tracking-tight">
                              {fullName}
                            </h2>

                            <p className="mt-1 break-all text-sm text-black/50">
                              {client.email}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="mt-7 grid gap-6 sm:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                              Assessment
                            </p>

                            <p className="mt-2 text-sm font-medium">
                              ✓ Completed
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                              Payment
                            </p>

                            <p className="mt-2 text-sm font-medium">
                              ⏳ Awaiting verification
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                              Brand DNA
                            </p>

                            <p className="mt-2 text-sm font-medium">
                              🔒 Locked
                            </p>
                          </div>
                        </div>

                        {assessment?.result && (
                          <p className="mt-6 text-xs text-black/35">
                            Brand DNA generated on{" "}
                            {new Date(
                              assessment.result.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Action */}
                      <div className="shrink-0 border-t border-black/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                        <p className="mb-3 text-xs leading-5 text-black/40 lg:max-w-xs">
                          Verify that the client has paid the
                          required 100 TND and that the receipt
                          received by email is valid.
                        </p>

                        <UnlockButton
                          userId={client.id}
                          clientName={fullName}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-black/10 pt-8">
          <div className="flex flex-col gap-4 text-xs text-black/40 md:flex-row md:items-center md:justify-between">
            <p>
              Barandy Admin · Payment verification
            </p>

            <p>
              Only verified payments should unlock Brand DNA.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}