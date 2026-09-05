import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BrandDNA = Record<string, unknown>;

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return (
      <p className="whitespace-pre-wrap text-base leading-7 text-black/65">
        {value}
      </p>
    );
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <p className="text-base text-black/65">
        {String(value)}
      </p>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li
            key={index}
            className="border-l-2 border-black/10 pl-4 text-base leading-7 text-black/65"
          >
            {renderValue(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="space-y-5">
        {Object.entries(value as Record<string, unknown>).map(
          ([key, nestedValue]) => (
            <div key={key}>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                {formatLabel(key)}
              </p>

              {renderValue(nestedValue)}
            </div>
          )
        )}
      </div>
    );
  }

  return null;
}

export default async function ResultsPage(): Promise<React.ReactNode> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      accessGranted: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const assessment = await prisma.assessment.findFirst({
    where: {
      userId: session.user.id,
      status: "COMPLETED",
      result: {
        isNot: null,
      },
    },
    include: {
      result: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!assessment?.result) {
    redirect("/assessment");
  }

  if (!user.accessGranted) {
    return (
      <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16 md:px-10">
          <div className="w-full">
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
                  Assessment Complete
                </p>

                <p className="mt-1 text-sm font-medium">
                  Brand DNA
                </p>
              </div>
            </header>

            <section className="mx-auto mt-24 max-w-3xl text-center md:mt-32">
              <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-black/40">
                Your Brand DNA is ready
              </p>

              <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                Your personal brand,
                <br />
                has been decoded.
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-black/55">
                You have completed your Barandy assessment.
                Your personalized Brand DNA has been generated
                and is ready to be revealed.
              </p>

              <div className="mx-auto mt-14 max-w-2xl border border-black/10 bg-white p-8 text-left md:p-10">
                <div className="flex items-start gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 text-sm">
                    🔒
                  </div>

                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      Your results are currently locked.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-black/55">
                      Your Brand DNA has already been generated.
                      To unlock your personalized profile, please
                      complete your payment and send your payment
                      receipt to the Barandy team.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/10 pt-8">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                    What happens next?
                  </p>

                  <div className="mt-6 space-y-5">
                    <div className="flex gap-5">
                      <span className="text-sm font-medium">
                        01
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Complete your payment
                        </p>

                        <p className="mt-1 text-sm leading-6 text-black/50">
                          Follow the payment instructions provided
                          by the Barandy team.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <span className="text-sm font-medium">
                        02
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Send your receipt
                        </p>

                        <p className="mt-1 text-sm leading-6 text-black/50">
                          Send your payment receipt to the Barandy
                          team for verification.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <span className="text-sm font-medium">
                        03
                      </span>

                      <div>
                        <p className="text-sm font-medium">
                          Get your Brand DNA
                        </p>

                        <p className="mt-1 text-sm leading-6 text-black/50">
                          Once your payment is verified, your
                          personalized Brand DNA will be unlocked.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/10 pt-8">
                  <Link
                    href="/payment"
                    className="block w-full bg-[#171519] px-6 py-4 text-center text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    Payment & Receipt Instructions
                  </Link>
                </div>
              </div>

              <Link
                href="/"
                className="mt-8 inline-block text-sm text-black/50 transition hover:text-black"
              >
                ← Back to Barandy
              </Link>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const brandDNA = assessment.result.brandDNA as BrandDNA;

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
        <header className="mb-16 flex items-center justify-between">
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
              Your Results
            </p>

            <p className="mt-1 text-sm font-medium">
              Brand DNA
            </p>
          </div>
        </header>

        <section className="mb-20 max-w-4xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-black/40">
            Your Brand DNA
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Your personal brand,
            <br />
            decoded.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/55">
            Your assessment has been analyzed. Below is your
            personalized Brand DNA profile.
          </p>
        </section>

        <section className="space-y-6">
          {Object.entries(brandDNA).map(([key, value]) => (
            <article
              key={key}
              className="border border-black/10 bg-white p-8 md:p-10"
            >
              <div className="mb-8 flex items-start justify-between gap-6 border-b border-black/10 pb-6">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {formatLabel(key)}
                </h2>

                <span className="text-xs uppercase tracking-[0.15em] text-black/30">
                  Brand DNA
                </span>
              </div>

              {renderValue(value)}
            </article>
          ))}
        </section>

        <footer className="mt-16 border-t border-black/10 pt-8">
          <p className="text-xs leading-6 text-black/40">
            Generated from your Barandy Personal Brand Intelligence
            assessment.
          </p>
        </footer>
      </div>
    </main>
  );
}