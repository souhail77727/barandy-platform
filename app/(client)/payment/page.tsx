import Link from "next/link";

const paymentMethods = [
  {
    number: "01",
    title: "Bank Transfer",
    description:
      "Make a bank transfer using the temporary details below.",
    details: [
      ["Bank", "BARANDY DEMO BANK"],
      ["Account Holder", "BARANDY — DEMO"],
      ["RIB", "00 000 000 000 000 000 000"],
    ],
  },
  {
    number: "02",
    title: "D17",
    description:
      "Send the payment through D17 using the temporary demo account.",
    details: [
      ["Phone", "+216 00 000 000"],
      ["Account", "BARANDY DEMO"],
    ],
  },
  {
    number: "03",
    title: "Flouci",
    description:
      "Make the payment through Flouci using the temporary demo account.",
    details: [
      ["Phone", "+216 00 000 000"],
      ["Account", "BARANDY DEMO"],
    ],
  },
];

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em]">
              BARANDY
            </p>

            <p className="mt-2 text-xs text-black/45">
              Personal Brand Intelligence
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Payment
            </p>

            <p className="mt-1 text-sm font-medium">
              Unlock Your Brand DNA
            </p>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto mt-24 max-w-3xl text-center md:mt-32">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-black/40">
            One final step
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Unlock your
            <br />
            Brand DNA.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-black/55">
            Your personalized Brand DNA has already been generated.
            Complete your payment using one of the methods below,
            then send us your payment receipt by email.
          </p>
        </section>

        {/* Amount */}
        <section className="mx-auto mt-16 max-w-2xl">
          <div className="border border-black/10 bg-white p-8 text-center md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Amount to pay
            </p>

            <p className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
              100
              <span className="ml-2 text-2xl font-medium text-black/45">
                TND
              </span>
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/50">
              Payment is made outside the Barandy platform.
              Choose the payment method that is most convenient
              for you.
            </p>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Payment methods
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Choose how you want to pay.
            </h2>
          </div>

          <div className="space-y-5">
            {paymentMethods.map((method) => (
              <article
                key={method.number}
                className="border border-black/10 bg-white p-7 md:p-9"
              >
                <div className="flex items-start gap-6">
                  <span className="shrink-0 text-sm font-medium text-black/40">
                    {method.number}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {method.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-black/50">
                      {method.description}
                    </p>

                    <div className="mt-6 border-t border-black/10 pt-6">
                      <div className="space-y-4">
                        {method.details.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                          >
                            <span className="text-xs uppercase tracking-[0.15em] text-black/40">
                              {label}
                            </span>

                            <span className="text-sm font-medium sm:text-right">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-6 text-xs leading-5 text-black/35">
                      Demo payment details — these will be replaced
                      with the official Barandy payment information.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Receipt Instructions */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="border border-black/10 bg-[#171519] p-8 text-white md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              After payment
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              Send us your receipt.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
              Once your payment is completed, send a clear copy
              of your payment receipt to the Barandy team by email.
              Your payment will then be verified manually.
            </p>

            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-xs uppercase tracking-[0.15em] text-white/40">
                Receipt email
              </p>

              <p className="mt-2 text-lg font-medium">
                payments@barandy.com
              </p>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Temporary demo email — replace with the official
                Barandy email before launch.
              </p>
            </div>
          </div>
        </section>

        {/* What Happens Next */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="border-t border-black/10 pt-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              What happens next?
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <span className="text-sm font-medium">01</span>

                <h3 className="mt-3 text-sm font-semibold">
                  Complete payment
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Pay 100 TND using your preferred payment method.
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">02</span>

                <h3 className="mt-3 text-sm font-semibold">
                  Send your receipt
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Email your payment receipt to the Barandy team.
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">03</span>

                <h3 className="mt-3 text-sm font-semibold">
                  Get access
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Once verified, your Brand DNA will be unlocked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Back */}
        <footer className="mx-auto mt-16 max-w-3xl border-t border-black/10 pt-8">
          <Link
            href="/results"
            className="text-sm text-black/50 transition hover:text-black"
          >
            ← Back to your results
          </Link>
        </footer>
      </div>
    </main>
  );
}