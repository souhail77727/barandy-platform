import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  ShieldCheck,
  Palette,
  Compass,
} from "lucide-react";

export default async function Home() {
  const session = await auth();

  const isSignedIn = !!session?.user?.id;
  const userName =
    session?.user?.name?.split(" ")[0] || "Client";

  let userRole: "CLIENT" | "ADMIN" | "DEVELOPER" | null = null;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    userRole = user?.role ?? null;
  }

  const isAdmin =
    userRole === "ADMIN" || userRole === "DEVELOPER";

  const primaryHref = !isSignedIn
    ? "/sign-up"
    : isAdmin
      ? "/admin"
      : "/assessment";

  const primaryLabel = !isSignedIn
    ? "Begin Diagnostic Assessment"
    : isAdmin
      ? "Open Admin Dashboard"
      : "Continue Assessment";

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519] selection:bg-[#D9B896] selection:text-[#171519]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#171519]/10 bg-[#F8F5F1]/80 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-primary text-2xl font-bold tracking-[0.25em] text-[#171519]">
            BARANDY
          </h1>

          <span className="hidden bg-[#171519] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#F8F5F1] sm:inline-block">
            BRAND DNA™
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <span className="text-xs text-[#171519]/60">
                {userName}
              </span>

              <Link
                href={isAdmin ? "/admin" : "/assessment"}
                className="bg-[#171519] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F8F5F1] shadow-sm transition-colors hover:bg-opacity-90"
              >
                {isAdmin
                  ? "Admin Dashboard"
                  : "Continue Assessment"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#171519]/70 transition-colors hover:text-[#171519]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="bg-[#171519] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F8F5F1] shadow-sm transition-colors hover:bg-opacity-90"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <div className="flex w-full flex-col items-center gap-8">

          {/* Logo */}
          <div className="flex h-20 w-20 items-center justify-center bg-[#171519]">
            <span className="font-primary text-3xl font-bold tracking-wider text-[#D9B896]">
              B
            </span>
          </div>

          {/* Headline */}
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#D9B896]">
              The Architecture of Influence & Personal Authority
            </span>

            <h1 className="font-primary text-4xl font-bold leading-[1.12] tracking-tight text-[#171519] sm:text-5xl md:text-6xl">
              Discover the DNA behind your personal brand.
            </h1>

            <p className="mt-2 mx-auto max-w-2xl text-lg font-normal leading-relaxed text-[#171519]/70 md:text-xl">
              A comprehensive diagnostic platform for visionary
              founders, executives, and leaders to establish
              uncontested positioning, archetypal resonance,
              and signature color intelligence.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-2 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:flex-row">

            <Link
              href={primaryHref}
              className="group relative flex h-14 w-full items-center justify-center bg-[#171519] px-8 text-[#F8F5F1] shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.15em]">
                {primaryLabel}

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="flex h-14 w-full items-center justify-center border border-[#171519]/10 bg-[#EEE4DA] px-6 text-xs font-semibold uppercase tracking-wider text-[#171519] transition-colors hover:bg-[#D9B896]/30 sm:w-auto"
            >
              Explore Sample Dossier
            </Link>

          </div>

          {/* Roadmap */}
          <div className="mt-12 w-full max-w-4xl border-t border-[#171519]/10 pt-10">
            <div className="mb-6 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D9B896]">
                BARANDY DIAGNOSTIC METHODOLOGY & CLIENT JOURNEY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4 md:grid-cols-7">
              {[
                {
                  step: "01",
                  title: "Registration",
                  desc: "Client ID Assignment",
                },
                {
                  step: "02",
                  title: "Values Analysis",
                  desc: "Core Ranking",
                },
                {
                  step: "03",
                  title: "IKIGAI Matrix",
                  desc: "4-Pillar Synthesis",
                },
                {
                  step: "04",
                  title: "Archetype Calibrator",
                  desc: "Dominance %",
                },
                {
                  step: "05",
                  title: "Brand DNA",
                  desc: "Executive Manifesto",
                },
                {
                  step: "06",
                  title: "Color Intelligence",
                  desc: "5-Color Palette",
                },
                {
                  step: "07",
                  title: "Client Dossier",
                  desc: "Strategy Dashboard",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col justify-between border border-[#171519]/10 bg-white p-3 shadow-sm"
                >
                  <span className="font-mono text-[10px] font-bold text-[#D9B896]">
                    {item.step}
                  </span>

                  <div className="my-1 text-[11px] font-bold text-[#171519]">
                    {item.title}
                  </div>

                  <div className="text-[10px] text-[#171519]/60">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-6 text-left md:grid-cols-3">

            <div className="border border-[#171519]/10 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-8 w-8 items-center justify-center border border-[#D9B896] bg-[#F8F5F1]">
                <Compass className="h-4 w-4 text-[#D9B896]" />
              </div>

              <h3 className="font-primary text-sm font-bold text-[#171519]">
                100% Deterministic Engine
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#171519]/70">
                Calculates your Brand DNA, archetype dominance,
                and perception balance locally with rigorous
                mathematical precision.
              </p>
            </div>

            <div className="border border-[#171519]/10 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-8 w-8 items-center justify-center border border-[#D9B896] bg-[#F8F5F1]">
                <Palette className="h-4 w-4 text-[#D9B896]" />
              </div>

              <h3 className="font-primary text-sm font-bold text-[#171519]">
                Value-to-Color Intelligence
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#171519]/70">
                Generates a bespoke 5-color palette derived from
                your top core values under the 60-30-10 editorial
                rule.
              </p>
            </div>

            <div className="border border-[#171519]/10 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-8 w-8 items-center justify-center border border-[#D9B896] bg-[#F8F5F1]">
                <ShieldCheck className="h-4 w-4 text-[#D9B896]" />
              </div>

              <h3 className="font-primary text-sm font-bold text-[#171519]">
                Confidential Client CRM
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#171519]/70">
                Persistent client accounts, unique BARANDY Client
                IDs, private consultant notes, and centralized
                client management.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#171519]/10 py-6 text-center text-xs text-[#171519]/50">
        BARANDY Strategic Personal Brand Architecture ·
        Confidential Client Management
      </footer>
    </div>
  );
}