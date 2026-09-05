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

  /*
   * ---------------------------------------------------------
   * STATE 1
   * Assessment has not been completed yet.
   * ---------------------------------------------------------
   */
  if (!assessmentCompleted) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="payment"
          showBack
        />

        <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Payment
            </p>

            <h1 className="mt-5 text-4xl font-medium tracking-[-0.03em] md:text-5xl">
              Complete your assessment first.
            </h1>

            <p className="mt-6 text-base leading-7 text-black/55">
              Your Brand DNA is generated from your completed assessment.
              Once the assessment is complete, your payment instructions will
              appear here.
            </p>

            <a
              href="/assessment"
              className="mt-10 inline-flex bg-[#171519] px-7 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
            >
              Start Assessment
            </a>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * STATE 2
   * Payment has been verified.
   * ---------------------------------------------------------
   */
  if (user.accessGranted || payment?.status === "PAID") {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="payment"
          showBack
        />

        <main className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Payment
            </p>

            <h1 className="mt-5 text-4xl font-medium tracking-[-0.03em] md:text-5xl">
              Payment confirmed.
            </h1>

            <p className="mt-6 text-base leading-7 text-black/55">
              Your payment has been verified and your Brand DNA is now
              unlocked.
            </p>

            <div className="mt-10 border border-black/10 bg-white p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 text-sm">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                    Verified
                  </p>

                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
                    Your Brand DNA is unlocked.
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-black/55">
                    You can now access your personalized Brand DNA profile.
                  </p>
                </div>
              </div>

              {payment && (
                <div className="mt-8 border-t border-black/10 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                        Payment amount
                      </p>

                      <p className="mt-2 text-xl font-medium">
                        {payment.amount}{" "}
                        {payment.currency.toUpperCase()}
                      </p>
                    </div>

                    <span className="border border-black/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em]">
                      Paid
                    </span>
                  </div>
                </div>
              )}

              <a
                href="/results"
                className="mt-8 inline-flex bg-[#171519] px-7 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
              >
                View Brand DNA
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * STATE 3
   * Payment is pending verification.
   *
   * IMPORTANT:
   * Payment instructions remain visible here.
   * ---------------------------------------------------------
   */
  if (payment?.status === "PENDING") {
    return (
      <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          firstName={user.firstName}
          currentPage="payment"
          showBack
        />

        <main className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          {/* Payment status */}
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Payment
            </p>

            <h1 className="mt-5 text-4xl font-medium tracking-[-0.03em] md:text-5xl">
              Payment under verification.
            </h1>

            <p className="mt-6 text-base leading-7 text-black/55">
              We have received your payment request. Your Brand DNA will be
              unlocked once the payment has been manually verified.
            </p>

            {/* Current payment status */}
            <div className="mt-10 border border-black/10 bg-white p-8 md:p-10">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                    Amount
                  </p>

                  <p className="mt-2 text-2xl font-medium">
                    {payment.amount}{" "}
                    {payment.currency.toUpperCase()}
                  </p>
                </div>

                <span className="border border-black/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-black/50">
                  Pending
                </span>
              </div>

              <div className="mt-8 border-t border-black/10 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  What happens next
                </p>

                <p className="mt-3 text-sm leading-6 text-black/55">
                  Our team will verify your payment manually. Once approved,
                  your Brand DNA will become available automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <section className="mt-16">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                Payment methods
              </p>

              <h2 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
                Payment details
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Keep these details for your records. If you have already
                completed the payment, simply wait for verification.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {/* Bank Transfer */}
              <div className="border border-black/10 bg-white p-7">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  Method 01
                </p>

                <h3 className="mt-5 text-xl font-medium">
                  Bank Transfer
                </h3>

                <div className="mt-6 space-y-4 text-sm text-black/55">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Amount
                    </p>

                    <p className="mt-1 font-medium text-black">
                      100 TND
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Bank
                    </p>

                    <p className="mt-1">
                      Barandy Business Account
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Reference
                    </p>

                    <p className="mt-1">
                      Your full name
                    </p>
                  </div>
                </div>
              </div>

              {/* D17 */}
              <div className="border border-black/10 bg-white p-7">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  Method 02
                </p>

                <h3 className="mt-5 text-xl font-medium">
                  D17
                </h3>

                <div className="mt-6 space-y-4 text-sm text-black/55">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Amount
                    </p>

                    <p className="mt-1 font-medium text-black">
                      100 TND
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Recipient
                    </p>

                    <p className="mt-1">
                      Barandy
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Reference
                    </p>

                    <p className="mt-1">
                      Your full name
                    </p>
                  </div>
                </div>
              </div>

              {/* Flouci */}
              <div className="border border-black/10 bg-white p-7">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                  Method 03
                </p>

                <h3 className="mt-5 text-xl font-medium">
                  Flouci
                </h3>

                <div className="mt-6 space-y-4 text-sm text-black/55">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Amount
                    </p>

                    <p className="mt-1 font-medium text-black">
                      100 TND
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Recipient
                    </p>

                    <p className="mt-1">
                      Barandy
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                      Reference
                    </p>

                    <p className="mt-1">
                      Your full name
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Receipt instructions */}
          <section className="mt-8 border border-black/10 bg-[#171519] p-8 text-white md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/45">
              Final step
            </p>

            <h2 className="mt-4 text-2xl font-medium">
              Send your payment receipt.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
              After completing the payment, send a screenshot or receipt to:
            </p>

            <p className="mt-5 text-lg font-medium">
              payments@barandy.com
            </p>

            <p className="mt-4 max-w-2xl text-xs leading-5 text-white/45">
              Include your full name and the payment method used. Your Brand
              DNA will be unlocked after manual verification.
            </p>
          </section>

          {/* Access check */}
          <div className="mt-8">
            <a
              href="/results"
              className="inline-flex border border-black/10 px-7 py-4 text-xs font-medium uppercase tracking-[0.15em] text-black/55 transition hover:border-black/20 hover:text-black"
            >
              Check Brand DNA Access
            </a>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * STATE 4
   * Assessment completed but no payment record exists.
   *
   * This normally should not happen because the completion API
   * creates a PENDING payment automatically.
   * ---------------------------------------------------------
   */
  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        firstName={user.firstName}
        currentPage="payment"
        showBack
      />

      <main className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Payment
          </p>

          <h1 className="mt-5 text-4xl font-medium tracking-[-0.03em] md:text-5xl">
            Unlock your Brand DNA.
          </h1>

          <p className="mt-6 text-base leading-7 text-black/55">
            Your assessment is complete. Make your payment using one of the
            methods below, then send your receipt for manual verification.
          </p>
        </div>

        {/* Payment methods */}
        <section className="mt-14">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Bank Transfer */}
            <div className="border border-black/10 bg-white p-7">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                Method 01
              </p>

              <h2 className="mt-5 text-xl font-medium">
                Bank Transfer
              </h2>

              <div className="mt-6 space-y-4 text-sm text-black/55">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Amount
                  </p>

                  <p className="mt-1 font-medium text-black">
                    100 TND
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Bank
                  </p>

                  <p className="mt-1">
                    Barandy Business Account
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Reference
                  </p>

                  <p className="mt-1">
                    Your full name
                  </p>
                </div>
              </div>
            </div>

            {/* D17 */}
            <div className="border border-black/10 bg-white p-7">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                Method 02
              </p>

              <h2 className="mt-5 text-xl font-medium">
                D17
              </h2>

              <div className="mt-6 space-y-4 text-sm text-black/55">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Amount
                  </p>

                  <p className="mt-1 font-medium text-black">
                    100 TND
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Recipient
                  </p>

                  <p className="mt-1">
                    Barandy
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Reference
                  </p>

                  <p className="mt-1">
                    Your full name
                  </p>
                </div>
              </div>
            </div>

            {/* Flouci */}
            <div className="border border-black/10 bg-white p-7">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                Method 03
              </p>

              <h2 className="mt-5 text-xl font-medium">
                Flouci
              </h2>

              <div className="mt-6 space-y-4 text-sm text-black/55">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Amount
                  </p>

                  <p className="mt-1 font-medium text-black">
                    100 TND
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Recipient
                  </p>

                  <p className="mt-1">
                    Barandy
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-black/35">
                    Reference
                  </p>

                  <p className="mt-1">
                    Your full name
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Receipt instructions */}
        <section className="mt-8 border border-black/10 bg-[#171519] p-8 text-white md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/45">
            Final step
          </p>

          <h2 className="mt-4 text-2xl font-medium">
            Send your payment receipt.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
            After completing the payment, send a screenshot or receipt to:
          </p>

          <p className="mt-5 text-lg font-medium">
            payments@barandy.com
          </p>

          <p className="mt-4 max-w-2xl text-xs leading-5 text-white/45">
            Include your full name and the payment method used. Your Brand DNA
            will be unlocked after manual verification.
          </p>
        </section>
      </main>
    </div>
  );
}