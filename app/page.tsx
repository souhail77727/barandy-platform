import Link from "next/link";
import { auth } from "@/auth";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Compass,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  const isSignedIn = !!session?.user?.id;
  const userName = session?.user?.name?.split(" ")[0] || "Client";

  const journey = [
    {
      step: "01",
      title: "Registration",
      desc: "Client identity & profile",
    },
    {
      step: "02",
      title: "Values Analysis",
      desc: "Core value ranking",
    },
    {
      step: "03",
      title: "IKIGAI Matrix",
      desc: "Four-pillar synthesis",
    },
    {
      step: "04",
      title: "Archetype",
      desc: "Dominance calibration",
    },
    {
      step: "05",
      title: "Brand DNA",
      desc: "Executive positioning",
    },
    {
      step: "06",
      title: "Color Intelligence",
      desc: "Signature palette",
    },
    {
      step: "07",
      title: "Client Dossier",
      desc: "Strategic brand system",
    },
  ];

  const methodology = [
    {
      icon: Compass,
      title: "Positioning",
      desc: "Clarify what you stand for, who you influence, and the territory your brand should own.",
    },
    {
      icon: Palette,
      title: "Visual Intelligence",
      desc: "Translate your internal values into a visual language through strategic color intelligence.",
    },
    {
      icon: ShieldCheck,
      title: "Private Intelligence",
      desc: "Your personal brand assessment remains inside a private and confidential client environment.",
    },
    {
      icon: Sparkles,
      title: "Brand DNA",
      desc: "Receive a concise strategic synthesis of your identity, tone, archetype, and positioning.",
    },
  ];

  const metrics = [
    {
      number: "07",
      label: "Diagnostic Dimensions",
    },
    {
      number: "04",
      label: "Core Identity Pillars",
    },
    {
      number: "05",
      label: "Color Intelligence Layers",
    },
    {
      number: "01",
      label: "Strategic Brand Dossier",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F3EE] text-[#171519] selection:bg-[#D9B896] selection:text-[#171519]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#171519]/10 bg-[#F7F3EE]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
          >
            <div className="flex h-10 w-10 items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img
                src="/LOGO.png"
                alt="Barandly - Personal Brand Intelligence"
                className="h-full w-full object-contain"
                loading="eager"
              />
            </div>

            <div className="hidden sm:block">
              <div className="font-sans bg-gradient-to-r from-[#171519] to-[#4A4349] bg-clip-text text-sm font-extrabold tracking-[0.18em] text-transparent">
                BARANDLY
              </div>

              <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#171519]/45">
                Brand Architecture
              </div>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-10 lg:flex"
            aria-label="Main navigation"
          >
            <a
              href="#methodology"
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171519]/55 transition-colors hover:text-[#171519]"
            >
              Methodology
            </a>

            <a
              href="#journey"
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171519]/55 transition-colors hover:text-[#171519]"
            >
              Journey
            </a>

            <a
              href="#philosophy"
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171519]/55 transition-colors hover:text-[#171519]"
            >
              Philosophy
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn ? (
              <>
                <span className="hidden font-sans text-xs font-medium text-[#171519]/60 sm:block">
                  Welcome, {userName}
                </span>

                <Link
                  href="/dashboard"
                  className="group relative inline-flex items-center gap-2 overflow-hidden border border-[#171519] bg-[#171519] px-4 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2A262A] hover:shadow-lg"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden rounded-md px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#171519]/60 transition-colors hover:text-[#171519] sm:block"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-2 border border-[#171519] bg-[#171519] px-4 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2A262A] hover:shadow-lg"
                >
                  <span>Begin</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="relative flex min-h-[calc(100vh-76px)] items-center overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-180px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full border border-[#D9B896]/20 animate-soft-pulse" />

            <div className="absolute right-[-220px] top-20 h-[600px] w-[600px] rounded-full border border-[#171519]/5 animate-soft-pulse animation-delay-2000" />

            <div className="absolute right-[10%] top-[20%] h-2 w-2 rounded-full bg-[#D9B896] animate-soft-ping" />

            <div className="absolute bottom-[18%] left-[12%] h-1.5 w-1.5 rounded-full bg-[#171519]/30 animate-soft-pulse" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
              {/* HERO COPY */}
              <div className="max-w-3xl animate-fade-in-up">
                <div className="mb-8 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#D9B896]" />

                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#171519]/55">
                    Personal Brand Intelligence
                  </span>
                </div>

                <h1 className="font-sans text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[82px]">
                  Your brand
                  <br />
                  has a{" "}
                  <span className="relative inline-block font-serif italic font-normal text-[#A98968]">
                    DNA.
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#D9B896]/30" />
                  </span>
                </h1>

                <p className="mt-8 max-w-xl font-sans text-base leading-8 text-[#171519]/65 sm:text-lg">
                  Barandly decodes the architecture behind your personal
                  brand — transforming your values, identity, archetype,
                  and perception into a coherent strategic system.
                </p>

                {/* CTA BUTTONS */}
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={isSignedIn ? "/dashboard" : "/sign-up"}
                    className="group relative inline-flex items-center justify-center gap-3 overflow-hidden border border-[#171519] bg-[#171519] px-7 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F7F3EE] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#2A262A] hover:shadow-xl"
                  >
                    <span>
                      {isSignedIn
                        ? "Open My Dashboard"
                        : "Begin Your Assessment"}
                    </span>

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

                    <span className="absolute inset-0 bg-gradient-to-r from-[#D9B896]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>

                  <a
                    href="#methodology"
                    className="group inline-flex items-center justify-center gap-3 border border-[#171519]/15 bg-white/40 px-7 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#171519]/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#171519]/30 hover:bg-white hover:text-[#171519]"
                  >
                    Explore Methodology

                    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                  </a>
                </div>

                {/* TRUST POINTS */}
                <div className="mt-10 flex flex-wrap items-center gap-5 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-[#171519]/45">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#A98968]" />
                    Deterministic Analysis
                  </div>

                  <div className="h-3 w-px bg-[#171519]/15" />

                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#A98968]" />
                    Private & Confidential
                  </div>
                </div>
              </div>

              {/* HERO VISUAL */}
              <div className="relative flex min-h-[440px] items-center justify-center animate-fade-in-up animation-delay-200 lg:min-h-[560px]">
                <div className="absolute h-[360px] w-[360px] rounded-full border border-[#D9B896]/30 animate-spin-slow sm:h-[440px] sm:w-[440px]" />

                <div className="absolute h-[290px] w-[290px] rounded-full border border-[#171519]/10 sm:h-[350px] sm:w-[350px]" />

                <div className="absolute right-[10%] top-[17%] flex h-14 w-14 items-center justify-center border border-[#D9B896]/50 bg-[#F7F3EE] shadow-lg animate-float">
                  <Sparkles className="h-5 w-5 text-[#A98968]" />
                </div>

                <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
                  <div className="absolute inset-0 rounded-full bg-[#D9B896]/10 blur-3xl" />

                  <img
                    src="/LOGO.png"
                    alt="Barandly Brand DNA"
                    className="relative h-full w-full object-contain drop-shadow-[0_20px_35px_rgba(23,21,25,0.12)]"
                    loading="eager"
                  />
                </div>

                <div className="absolute bottom-[8%] left-[5%] border border-[#171519]/10 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#A98968]">
                    BARANDLY
                  </div>

                  <div className="mt-1 font-sans text-xs font-extrabold tracking-wide">
                    Brand DNA™
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="mt-12 hidden items-center gap-3 animate-fade-in-up lg:flex">
              <div className="h-px w-10 bg-[#171519]/20" />

              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#171519]/40">
                Scroll to decode
              </span>

              <ArrowDown className="h-3 w-3 text-[#A98968] animate-bounce" />
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="border-y border-[#171519]/10 bg-[#171519] text-[#F7F3EE]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`group relative px-6 py-10 sm:px-8 lg:px-10 lg:py-12 ${
                  index !== metrics.length - 1
                    ? "border-b border-[#F7F3EE]/10 lg:border-b-0 lg:border-r"
                    : ""
                } ${
                  index === 0
                    ? "border-r border-[#F7F3EE]/10"
                    : index === 2
                      ? "border-r border-[#F7F3EE]/10"
                      : ""
                }`}
              >
                <div className="font-sans text-4xl font-extrabold tracking-[-0.04em] text-[#D9B896] transition-transform duration-300 group-hover:-translate-y-1 sm:text-5xl">
                  {metric.number}
                </div>

                <div className="mt-3 max-w-[150px] font-sans text-[9px] font-bold uppercase leading-5 tracking-[0.16em] text-[#F7F3EE]/55">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* METHODOLOGY */}
        <section
          id="methodology"
          className="border-b border-[#171519]/10 bg-[#F7F3EE]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#D9B896]" />

                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#171519]/45">
                    The Method
                  </span>
                </div>

                <h2 className="mt-6 font-sans text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  Strategy before
                  <br />
                  <span className="font-serif font-normal italic text-[#A98968]">
                    aesthetics.
                  </span>
                </h2>

                <p className="mt-6 max-w-md font-sans text-sm leading-7 text-[#171519]/60">
                  Your visual identity should not be random. Barandly starts
                  with the person behind the brand, then translates that
                  identity into a strategic system.
                </p>

                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="group mt-8 inline-flex items-center gap-3 border-b border-[#171519]/30 pb-2 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] transition-all hover:border-[#A98968]"
                >
                  {isSignedIn ? "Continue My Journey" : "Start My Analysis"}

                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid gap-px border border-[#171519]/10 bg-[#171519]/10 sm:grid-cols-2">
                {methodology.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group bg-[#F7F3EE] p-7 transition-colors duration-300 hover:bg-white sm:p-8"
                    >
                      <div className="flex h-11 w-11 items-center justify-center border border-[#171519]/10 transition-all duration-300 group-hover:border-[#D9B896] group-hover:bg-[#D9B896]/10">
                        <Icon className="h-5 w-5 text-[#A98968]" />
                      </div>

                      <h3 className="mt-6 font-sans text-sm font-extrabold uppercase tracking-[0.08em]">
                        {item.title}
                      </h3>

                      <p className="mt-3 font-sans text-sm leading-7 text-[#171519]/55">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section
          id="journey"
          className="border-b border-[#171519]/10 bg-white"
        >
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#D9B896]" />

                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#171519]/45">
                  The Journey
                </span>
              </div>

              <h2 className="mt-6 font-sans text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                From identity
                <br />
                to{" "}
                <span className="font-serif font-normal italic text-[#A98968]">
                  architecture.
                </span>
              </h2>

              <p className="mt-6 max-w-xl font-sans text-sm leading-7 text-[#171519]/60">
                A structured diagnostic journey designed to progressively
                transform personal insight into a coherent brand system.
              </p>
            </div>

            <div className="mt-16 grid gap-px border border-[#171519]/10 bg-[#171519]/10 md:grid-cols-2 lg:grid-cols-4">
              {journey.map((item, index) => (
                <div
                  key={item.step}
                  className="group relative min-h-[190px] bg-white p-7 transition-all duration-300 hover:bg-[#F7F3EE]"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#A98968]">
                      {item.step}
                    </span>

                    <ArrowRight className="h-4 w-4 text-[#171519]/15 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#A98968]" />
                  </div>

                  <h3 className="mt-12 font-sans text-sm font-extrabold uppercase tracking-[0.08em]">
                    {item.title}
                  </h3>

                  <p className="mt-2 font-sans text-xs leading-6 text-[#171519]/50">
                    {item.desc}
                  </p>

                  {index < journey.length - 1 && (
                    <div className="absolute bottom-0 left-7 right-7 h-px bg-[#171519]/5 lg:hidden" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="group inline-flex items-center gap-3 bg-[#171519] px-7 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-1 hover:bg-[#2A262A] hover:shadow-xl"
              >
                {isSignedIn ? "Open My Dashboard" : "Start the 7-Step Journey"}

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section id="philosophy" className="bg-[#171519] text-[#F7F3EE]">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
            <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#D9B896]" />

                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#F7F3EE]/45">
                    Philosophy
                  </span>
                </div>

                <h2 className="mt-7 max-w-3xl font-sans text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Your personal brand is not
                  <span className="font-serif font-normal italic text-[#D9B896]">
                    {" "}
                    decoration.
                  </span>
                </h2>

                <p className="mt-7 max-w-2xl font-sans text-base leading-8 text-[#F7F3EE]/60">
                  It is the perception created by your decisions, your
                  behavior, your values, your visual language, and the
                  consistency between them.
                </p>

                <div className="mt-10">
                  <Link
                    href={isSignedIn ? "/dashboard" : "/sign-up"}
                    className="group inline-flex items-center gap-3 border border-[#D9B896]/50 px-7 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#D9B896] transition-all duration-300 hover:-translate-y-1 hover:border-[#D9B896] hover:bg-[#D9B896]/10"
                  >
                    {isSignedIn
                      ? "View My Brand System"
                      : "Discover My Brand DNA"}

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[320px] items-center justify-center">
                <div className="absolute h-[280px] w-[280px] rounded-full border border-[#D9B896]/20 animate-spin-slow" />

                <div className="absolute h-[210px] w-[210px] rounded-full border border-[#F7F3EE]/10" />

                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#D9B896]/40 bg-[#D9B896]/5">
                  <Sparkles className="h-8 w-8 text-[#D9B896]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-[#171519]/10 bg-gradient-to-b from-[#F7F3EE] to-white">
          <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:px-8 lg:px-10 lg:py-32">
            <div className="mx-auto max-w-3xl">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#A98968]">
                Your next layer
              </span>

              <h2 className="mt-6 font-sans text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Make your identity
                <br />
                <span className="font-serif font-normal italic text-[#A98968]">
                  intentional.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-7 text-[#171519]/55">
                Start with the diagnostic. Discover the patterns behind your
                identity and build a brand system around them.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="group inline-flex w-full items-center justify-center gap-3 bg-[#171519] px-8 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-1 hover:bg-[#2A262A] hover:shadow-xl sm:w-auto"
                >
                  {isSignedIn
                    ? "Open My Dashboard"
                    : "Begin Diagnostic Assessment"}

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#methodology"
                  className="inline-flex w-full items-center justify-center gap-3 border border-[#171519]/15 px-8 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#171519]/65 transition-all duration-300 hover:border-[#171519]/30 hover:bg-white hover:text-[#171519] sm:w-auto"
                >
                  How It Works
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#171519]/10 bg-[#F7F3EE]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center">
              <img
                src="/LOGO.png"
                alt="Barandly"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <div className="font-sans text-[10px] font-extrabold tracking-[0.18em]">
                BARANDLY
              </div>

              <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#171519]/40">
                Personal Brand Intelligence
              </div>
            </div>
          </div>

          <div className="font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#171519]/35">
            © {new Date().getFullYear()} Barandly. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes soft-pulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.03);
          }
        }

        @keyframes soft-ping {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.5);
          }

          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-soft-pulse {
          animation: soft-pulse 5s ease-in-out infinite;
        }

        .animate-soft-ping {
          animation: soft-ping 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 24s linear infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}