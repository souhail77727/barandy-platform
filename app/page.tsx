import Link from "next/link";
import { auth } from "@/auth";
import { ArrowRight, ShieldCheck, Palette, Compass } from "lucide-react";

export default async function Home() {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;
  const userName = session?.user?.name?.split(" ")[0] || "Client";

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519] selection:bg-[#D9B896] selection:text-[#171519]">
      {/* Header */}
      <header className="flex justify-between items-center py-6 px-8 border-b border-[#171519]/10 bg-[#F8F5F1]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-primary font-bold text-2xl tracking-[0.25em] text-[#171519]">
            BARANDY
          </h1>

          <span className="text-[9px] uppercase tracking-widest font-mono bg-[#171519] text-[#F8F5F1] px-2 py-0.5 hidden sm:inline-block">
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
                href="/assessment"
                className="text-xs uppercase tracking-widest font-semibold bg-[#171519] text-[#F8F5F1] hover:bg-opacity-90 transition-colors px-3.5 py-1.5 shadow-sm"
              >
                Continue Assessment
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs uppercase tracking-widest font-semibold text-[#171519]/70 hover:text-[#171519] transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="text-xs uppercase tracking-widest font-semibold bg-[#171519] text-[#F8F5F1] hover:bg-opacity-90 transition-colors px-3.5 py-1.5 shadow-sm"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo */}
          <div className="w-20 h-20 bg-[#171519] flex items-center justify-center">
            <span className="text-[#D9B896] font-primary font-bold text-3xl tracking-wider">
              B
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#D9B896] font-mono">
              The Architecture of Influence & Personal Authority
            </span>

            <h1 className="font-primary font-bold text-4xl sm:text-5xl md:text-6xl text-[#171519] tracking-tight leading-[1.12]">
              Discover the DNA behind your personal brand.
            </h1>

            <p className="text-lg md:text-xl text-[#171519]/70 max-w-2xl mx-auto font-normal leading-relaxed mt-2">
              A comprehensive diagnostic platform for visionary founders,
              executives, and leaders to establish uncontested positioning,
              archetypal resonance, and signature color intelligence.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full justify-center max-w-md">
            <Link
              href={isSignedIn ? "/assessment" : "/sign-up"}
              className="group relative flex items-center justify-center h-14 px-8 bg-[#171519] hover:bg-opacity-90 text-[#F8F5F1] transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <span className="text-sm font-medium uppercase tracking-[0.15em] relative z-10 flex items-center gap-3">
                {isSignedIn
                  ? "Continue Assessment"
                  : "Begin Diagnostic Assessment"}

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="h-14 px-6 bg-[#EEE4DA] hover:bg-[#D9B896]/30 text-[#171519] border border-[#171519]/10 text-xs font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto flex items-center justify-center"
            >
              Explore Sample Dossier
            </Link>
          </div>

          {/* Steps Roadmap */}
          <div className="w-full max-w-4xl mt-12 pt-10 border-t border-[#171519]/10">
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D9B896] font-semibold">
                BARANDY DIAGNOSTIC METHODOLOGY & CLIENT JOURNEY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
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
                  className="p-3 bg-white border border-[#171519]/10 flex flex-col justify-between shadow-sm"
                >
                  <span className="font-mono text-[10px] text-[#D9B896] font-bold">
                    {item.step}
                  </span>

                  <div className="font-bold text-[11px] text-[#171519] my-1">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-6 text-left">
            <div className="p-6 bg-white border border-[#171519]/10 shadow-sm">
              <div className="w-8 h-8 bg-[#F8F5F1] border border-[#D9B896] flex items-center justify-center mb-3">
                <Compass className="w-4 h-4 text-[#D9B896]" />
              </div>

              <h3 className="font-primary font-bold text-sm text-[#171519]">
                100% Deterministic Engine
              </h3>

              <p className="text-xs text-[#171519]/70 mt-2 leading-relaxed">
                Calculates your Brand DNA, archetype dominance, and perception
                balance locally with rigorous mathematical precision.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#171519]/10 shadow-sm">
              <div className="w-8 h-8 bg-[#F8F5F1] border border-[#D9B896] flex items-center justify-center mb-3">
                <Palette className="w-4 h-4 text-[#D9B896]" />
              </div>

              <h3 className="font-primary font-bold text-sm text-[#171519]">
                Value-to-Color Intelligence
              </h3>

              <p className="text-xs text-[#171519]/70 mt-2 leading-relaxed">
                Generates a bespoke 5-color palette derived from your top core
                values under the 60-30-10 editorial rule.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#171519]/10 shadow-sm">
              <div className="w-8 h-8 bg-[#F8F5F1] border border-[#D9B896] flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-[#D9B896]" />
              </div>

              <h3 className="font-primary font-bold text-sm text-[#171519]">
                Confidential Client CRM
              </h3>

              <p className="text-xs text-[#171519]/70 mt-2 leading-relaxed">
                Persistent client accounts, unique BARANDY Client IDs, private
                consultant notes, and Google Sheets synchronization.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#171519]/50 py-6 border-t border-[#171519]/10">
        BARANDY Strategic Personal Brand Architecture • Confidential Client
        Management
      </footer>
    </div>
  );
}