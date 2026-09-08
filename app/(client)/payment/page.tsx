
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ClientHeader from "@/components/layout/ClientHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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
          id: true,
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

  if (!user) {
    redirect("/sign-in");
  }

  const assessmentCompleted = user.assessments.length > 0;
  const payment = user.payments[0];

  const paymentAmount = payment?.amount ?? 100;
  const paymentCurrency = payment?.currency?.toUpperCase() ?? "TND";

  /*
   * =========================================================
   * STATE 1
   * Assessment not completed
   * =========================================================
   */

  if (!assessmentCompleted) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="payment"
          showBack
        />

        <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-3xl">
            {/* Intro */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-sm">
                01
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                Your journey
              </p>

              <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-5xl">
                Complete your assessment first.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/55">
                Your Brand DNA is created from your assessment responses.
                Complete it first, then return here to unlock your personalized
                results.
              </p>
            </div>

            {/* Progress card */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="p-7 md:p-9">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40">
                      Current step
                    </p>

                    <h2 className="mt-2 text-xl font-medium">
                      Brand Assessment
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#F8F5F1] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-black/50">
                    Incomplete
                  </span>
                </div>

                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full w-1/3 rounded-full bg-[#171519]" />
                </div>

                <p className="mt-4 text-sm text-black/50">
                  Complete your assessment to continue to payment.
                </p>
              </div>

              <div className="border-t border-black/10 bg-[#FAF8F5] p-5 md:px-7">
                <a
                  href="/assessment"
                  className="flex w-full items-center justify-center rounded-xl bg-[#171519] px-6 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-black/80"
                >
                  Start assessment
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
   * STATE 2
   * Payment verified
   * =========================================================
   */

  if (user.accessGranted || payment?.status === "PAID") {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="payment"
          showBack
        />

        <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-3xl">
            {/* Success header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#171519] text-xl text-white">
                ✓
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                Payment complete
              </p>

              <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-5xl">
                Your Brand DNA is ready.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/55">
                Your payment has been verified and your personalized Brand DNA
                profile is now unlocked.
              </p>
            </div>

            {/* Main success card */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="p-7 md:p-9">
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8F5F1] text-sm">
                    ✓
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                      Verified
                    </p>

                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em]">
                      Access unlocked
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-black/55">
                      Everything is ready. Explore your personalized profile
                      and discover the key elements of your Brand DNA.
                    </p>
                  </div>
                </div>

                {payment && (
                  <div className="mt-8 grid gap-4 border-t border-black/10 pt-7 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#F8F5F1] p-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                        Payment
                      </p>

                      <p className="mt-2 text-lg font-medium">
                        {paymentAmount} {paymentCurrency}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F8F5F1] p-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                        Status
                      </p>

                      <p className="mt-2 text-lg font-medium">
                        Verified
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-black/10 bg-[#FAF8F5] p-5 md:p-7">
                <a
                  href="/results"
                  className="flex w-full items-center justify-center rounded-xl bg-[#171519] px-6 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-black/80"
                >
                  View my Brand DNA
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
   * STATE 3
   * Payment pending
   * =========================================================
   */

  if (payment?.status === "PENDING") {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="payment"
          showBack
        />

        <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white text-lg">
                …
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                Payment status
              </p>

              <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-5xl">
                We’re verifying your payment.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/55">
                Your payment request has been received. Once our team confirms
                it, your Brand DNA will be unlocked.
              </p>
            </div>

            {/* Status card */}
            <div className="mt-12 rounded-2xl border border-black/10 bg-white p-7 md:p-9">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                    Amount paid
                  </p>

                  <p className="mt-2 text-3xl font-medium tracking-[-0.03em]">
                    {paymentAmount} {paymentCurrency}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-[#F8F5F1] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-black/50">
                  Pending verification
                </span>
              </div>

              <div className="mt-8 border-t border-black/10 pt-7">
                <div className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171519] text-xs text-white">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Our team reviews your payment
                    </p>

                    <p className="mt-1 text-sm leading-6 text-black/50">
                      Once approved, access to your Brand DNA will be activated
                      automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <section className="mt-14">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  Payment information
                </p>

                <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
                  Payment methods
                </h2>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Use one of the available methods below. If you have already
                  paid, no action is required.
                </p>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-3">
                <PaymentMethod
                  number="01"
                  title="Bank Transfer"
                  details={[
                    ["Amount", "100 TND"],
                    ["Bank", "Barandy Business Account"],
                    ["Reference", "Your full name"],
                  ]}
                />

                <PaymentMethod
                  number="02"
                  title="D17"
                  details={[
                    ["Amount", "100 TND"],
                    ["Recipient", "Barandy"],
                    ["Reference", "Your full name"],
                  ]}
                />

                <PaymentMethod
                  number="03"
                  title="Flouci"
                  details={[
                    ["Amount", "100 TND"],
                    ["Recipient", "Barandy"],
                    ["Reference", "Your full name"],
                  ]}
                />
              </div>
            </section>

            {/* Receipt */}
            <section className="mt-7 overflow-hidden rounded-2xl bg-[#171519] text-white">
              <div className="p-7 md:p-9">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Need to send your receipt?
                </p>

                <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
                  Send your payment proof.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                  Send your receipt or screenshot with your full name and
                  payment method so our team can verify your transaction.
                </p>

                <div className="mt-6 inline-flex rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  payments@barandy.com
                </div>
              </div>
            </section>

            {/* Bottom action */}
            <div className="mt-8 flex justify-center">
              <a
                href="/results"
                className="inline-flex rounded-xl border border-black/10 bg-white px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-black/60 transition hover:border-black/20 hover:text-black"
              >
                Check Brand DNA access
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * =========================================================
   * STATE 4
   * Assessment complete — payment required
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        firstName={user.firstName}
        currentPage="payment"
        showBack
      />

      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm shadow-sm">
              02
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Almost there
            </p>

            <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-5xl">
              Unlock your Brand DNA.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/55">
              Your assessment is complete. Choose a payment method below, then
              send us your receipt for verification.
            </p>
          </div>

          {/* Price */}
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-black/10 bg-white p-7 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
              One-time access
            </p>

            <div className="mt-3">
              <span className="text-4xl font-medium tracking-[-0.04em]">
                100
              </span>

              <span className="ml-2 text-sm text-black/45">TND</span>
            </div>

            <p className="mt-3 text-sm text-black/45">
              Personalized Brand DNA profile
            </p>
          </div>

          {/* Payment methods */}
          <section className="mt-14">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                Step 1
              </p>

              <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
                Choose a payment method
              </h2>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <PaymentMethod
                number="01"
                title="Bank Transfer"
                details={[
                  ["Amount", "100 TND"],
                  ["Bank", "Barandy Business Account"],
                  ["Reference", "Your full name"],
                ]}
              />

              <PaymentMethod
                number="02"
                title="D17"
                details={[
                  ["Amount", "100 TND"],
                  ["Recipient", "Barandy"],
                  ["Reference", "Your full name"],
                ]}
              />

              <PaymentMethod
                number="03"
                title="Flouci"
                details={[
                  ["Amount", "100 TND"],
                  ["Recipient", "Barandy"],
                  ["Reference", "Your full name"],
                ]}
              />
            </div>
          </section>

          {/* Receipt */}
          <section className="mt-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Step 2
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl bg-[#171519] text-white">
              <div className="p-7 md:p-9">
                <h2 className="text-2xl font-medium tracking-[-0.02em]">
                  Send your payment receipt
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                  After completing your payment, send a screenshot or receipt
                  including your full name and payment method.
                </p>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-5 py-3.5 text-sm">
                    payments@barandy.com
                  </div>

                  <span className="text-xs text-white/40">
                    Manual verification
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* What happens next */}
          <section className="mt-8 rounded-2xl border border-black/10 bg-white p-7 md:p-9">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
              What happens next?
            </p>

            <div className="mt-7 grid gap-7 md:grid-cols-3">
              <Step
                number="01"
                title="Make payment"
                description="Choose one of the available payment methods."
              />

              <Step
                number="02"
                title="Send receipt"
                description="Send your payment proof to our team."
              />

              <Step
                number="03"
                title="Get access"
                description="Your Brand DNA unlocks after verification."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/*
 * =========================================================
 * Reusable payment method card
 * =========================================================
 */

function PaymentMethod({
  number,
  title,
  details,
}: {
  number: string;
  title: string;
  details: [string, string][];
}) {
  return (
    <div className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/35">
          Method {number}
        </span>

        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F8F5F1] text-xs">
          →
        </span>
      </div>

      <h3 className="mt-5 text-xl font-medium tracking-[-0.02em]">
        {title}
      </h3>

      <div className="mt-6 space-y-4">
        {details.map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/35">
              {label}
            </p>

            <p className="mt-1 text-sm text-black/65">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * =========================================================
 * Reusable journey step
 * =========================================================
 */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171519] text-[10px] font-medium text-white">
        {number}
      </div>

      <h3 className="mt-4 text-sm font-medium">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/50">
        {description}
      </p>
    </div>
  );
}

