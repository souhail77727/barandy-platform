
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type BrandDNA = {
  [key: string]: unknown;
};

function formatLabel(key: string) {
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

export default async function ResultsPage() {
  const session = await auth();

  if (!session?.user?.id) {
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

  const brandDNA = assessment.result.brandDNA as BrandDNA;

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
        {/* Header */}
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

        {/* Hero */}
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

        {/* Brand DNA */}
        <section className="space-y-6">
          {Object.entries(brandDNA).map(
            ([key, value]) => (
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
            )
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-black/10 pt-8">
          <p className="text-xs leading-6 text-black/40">
            Generated from your Barandy Personal Brand
            Intelligence assessment.
          </p>
        </footer>
      </div>
    </main>
  );
}

