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
      icon: "",
    },
    {
      step: "02",
      title: "Values Analysis",
      desc: "Core value ranking",
      icon: "",
    },
    {
      step: "03",
      title: "IKIGAI Matrix",
      desc: "Four-pillar synthesis",
      icon: "",
    },
    {
      step: "04",
      title: "Archetype",
      desc: "Dominance calibration",
      icon: "",
    },
    {
      step: "05",
      title: "Brand DNA",
      desc: "Executive positioning",
      icon: "",
    },
    {
      step: "06",
      title: "Color Intelligence",
      desc: "Signature palette",
      icon: "",
    },
    {
      step: "07",
      title: "Client Dossier",
      desc: "Strategic brand system",
      icon: "",
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

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-[#171519]/10 bg-[#F7F3EE]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">

          {/* Brand */}

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

              <div className="bg-gradient-to-r from-[#171519] to-[#4A4349] bg-clip-text font-primary text-sm font-bold tracking-[0.18em] text-transparent">
                BARANDLY
              </div>

              <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#171519]/45">
                Brand Architecture
              </div>

            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav
            className="hidden items-center gap-10 lg:flex"
            aria-label="Main navigation"
          >
            {[
              {
                href: "#methodology",
                label: "Methodology",
              },
              {
                href: "#journey",
                label: "The Process",
              },
              {
                href: "#philosophy",
                label: "Philosophy",
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#171519]/55 transition-colors duration-300 hover:text-[#171519] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
              >
                {item.label}

                <span className="absolute bottom-0 left-2 h-[2px] w-0 bg-[#D9B896] transition-all duration-300 group-hover:w-[calc(100%-16px)]" />
              </a>
            ))}
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-2 sm:gap-4">

            {isSignedIn ? (
              <>
                <span className="hidden text-xs font-medium text-[#171519]/60 sm:block">
                  Welcome, {userName}
                </span>

                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2 bg-[#171519] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F7F3EE] transition-all duration-300 hover:bg-[#29272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
                >
                  Dashboard

                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden rounded-md px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#171519]/60 transition-all duration-300 hover:bg-[#171519]/5 hover:text-[#171519] sm:block"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="group flex items-center gap-2 bg-[#171519] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F7F3EE] transition-all duration-300 hover:bg-[#29272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
                >
                  Begin

                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            )}

          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

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

              {/* ===================================================== */}
              {/* HERO LEFT */}
              {/* ===================================================== */}

              <div className="max-w-3xl animate-fade-in-up">

                <div className="mb-8 flex items-center gap-3">

                  <span className="h-px w-10 bg-[#D9B896]" />

                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171519]/55">
                    Personal Brand Intelligence
                  </span>

                </div>

                <h1 className="font-primary text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl xl:text-[82px]">

                  Your brand
                  <br />

                  has a{" "}

                  <span className="relative inline-block italic text-[#A98968]">

                    DNA.

                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#D9B896]/30" />

                  </span>

                </h1>

                <p className="mt-8 max-w-xl text-base leading-8 text-[#171519]/65 sm:text-lg">
                  Barandly decodes the architecture behind your personal
                  brand — transforming your values, identity, archetype,
                  and perception into a coherent strategic system.
                </p>

                {/* CTA */}

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href={isSignedIn ? "/dashboard" : "/sign-up"}
                    className="group relative flex h-14 items-center justify-center gap-4 overflow-hidden bg-[#171519] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7F3EE] shadow-xl shadow-[#171519]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#29272A] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
                  >

                    <span className="relative z-10">
                      {isSignedIn
                        ? "Open My Dashboard"
                        : "Begin Your Assessment"}
                    </span>

                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

                    <span className="absolute inset-0 bg-gradient-to-r from-[#D9B896]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  </Link>

                  <a
                    href="#methodology"
                    className="group flex h-14 items-center justify-center gap-3 border border-[#171519]/15 bg-[#F7F3EE] px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#171519] transition-all duration-300 hover:border-[#171519]/30 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
                  >
                    Explore Methodology

                    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />

                  </a>

                </div>

                {/* Trust */}

                <div className="mt-10 flex flex-wrap items-center gap-5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#171519]/40">

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

              {/* ===================================================== */}
              {/* HERO RIGHT */}
              {/* ===================================================== */}

              <div className="relative flex min-h-[440px] items-center justify-center animate-fade-in-up animation-delay-200 lg:min-h-[560px]">

                {/* Outer ring */}

                <div className="absolute h-[360px] w-[360px] rounded-full border border-[#D9B896]/30 animate-spin-slow sm:h-[440px] sm:w-[440px]" />

                {/* Inner ring */}

                <div className="absolute h-[290px] w-[290px] rounded-full border border-[#171519]/10 sm:h-[350px] sm:w-[350px]" />

                {/* Gold accent */}

                <div className="absolute right-[10%] top-[17%] flex h-14 w-14 items-center justify-center border border-[#D9B896]/50 bg-[#F7F3EE] shadow-lg animate-float">

                  <Sparkles className="h-5 w-5 text-[#A98968]" />

                </div>

                {/* Logo */}

                <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">

                  <div className="absolute inset-0 rounded-full bg-[#D9B896]/10 blur-3xl" />

                  <img
                    src="/LOGO.png"
                    alt="Barandly Brand DNA"
                    className="relative h-full w-full object-contain drop-shadow-[0_20px_35px_rgba(23,21,25,0.12)]"
                    loading="eager"
                  />

                </div>

                {/* Floating label */}

                <div className="absolute bottom-[8%] left-[5%] border border-[#171519]/10 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">

                  <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#A98968]">
                    BARANDLY
                  </div>

                  <div className="mt-1 text-xs font-semibold tracking-wide">
                    Brand DNA™
                  </div>

                </div>

              </div>

            </div>

            {/* Scroll */}

            <div className="mt-12 hidden items-center gap-3 animate-fade-in-up lg:flex">

              <div className="h-px w-8 bg-[#171519]/20" />

              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#171519]/35">
                Scroll to explore
              </span>

              <div className="h-px w-8 bg-[#171519]/20" />

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* METRICS */}
        {/* ========================================================= */}

        <section className="border-y border-[#171519]/10 bg-[#171519] text-[#F7F3EE]">

          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">

            {metrics.map((item, index) => (

              <div
                key={item.label}
                className={`group px-6 py-10 transition-all duration-300 hover:bg-white/[0.03] sm:px-10 sm:py-12 ${
                  index !== 3
                    ? "border-r border-[#F7F3EE]/10"
                    : ""
                } ${
                  index === 1
                    ? "max-lg:border-r-0"
                    : ""
                } ${
                  index >= 2
                    ? "max-lg:border-t max-lg:border-[#F7F3EE]/10"
                    : ""
                }`}
              >

                <div className="font-primary text-4xl font-bold tracking-tight text-[#D9B896] transition-transform duration-300 group-hover:scale-105 sm:text-5xl">
                  {item.number}
                </div>

                <div className="mt-3 max-w-[150px] text-[9px] font-medium uppercase leading-relaxed tracking-[0.18em] text-[#F7F3EE]/55">
                  {item.label}
                </div>

              </div>

            ))}

          </div>

        </section>

        {/* ========================================================= */}
        {/* METHODOLOGY */}
        {/* ========================================================= */}

        <section
          id="methodology"
          className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
        >

          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Intro */}

            <div className="animate-fade-in-up">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#D9B896]" />

                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-[#171519]/50">
                  The Methodology
                </span>

              </div>

              <h2 className="mt-6 font-primary text-4xl font-bold leading-tight tracking-tight sm:text-5xl">

                From identity
                <br />

                to{" "}

                <span className="italic text-[#A98968]">
                  influence.
                </span>

              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#171519]/60">
                A structured diagnostic designed to reveal the
                strategic patterns already present within your
                personal identity.
              </p>

            </div>

            {/* Cards */}

            <div className="grid gap-4 sm:grid-cols-2">

              {methodology.map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group border border-[#171519]/10 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#D9B896]/60 hover:shadow-xl"
                  >

                    <div className="mb-8 flex h-10 w-10 items-center justify-center border border-[#D9B896] bg-[#F7F3EE] transition-all duration-300 group-hover:bg-[#D9B896]">

                      <Icon className="h-4 w-4 text-[#A98968] transition-colors duration-300 group-hover:text-white" />

                    </div>

                    <h3 className="font-primary text-lg font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-[#171519]/60">
                      {item.desc}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* JOURNEY */}
        {/* ========================================================= */}

        <section
          id="journey"
          className="border-y border-[#171519]/10 bg-[#EEE7DF]"
        >

          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

            <div className="max-w-2xl">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#D9B896]" />

                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-[#171519]/50">
                  Client Journey
                </span>

              </div>

              <h2 className="mt-6 font-primary text-4xl font-bold tracking-tight sm:text-5xl">

                Seven layers.
                <br />

                <span className="italic text-[#A98968]">
                  One identity.
                </span>

              </h2>

              <p className="mt-5 text-sm leading-7 text-[#171519]/60">
                Every stage contributes to the final Brand DNA
                dossier — moving from raw self-perception to a
                coherent strategic architecture.
              </p>

            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {journey.map((item, index) => (

                <div
                  key={item.step}
                  className={`group relative border border-[#171519]/10 bg-[#F7F3EE] p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl ${
                    index === 4
                      ? "lg:col-span-2"
                      : ""
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <span className="text-lg">
                        {item.icon}
                      </span>

                      <span className="font-mono text-[10px] font-bold tracking-widest text-[#A98968]">
                        {item.step}
                      </span>

                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-[#171519]/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#A98968]" />

                  </div>

                  <div className="mt-8">

                    <h3 className="font-primary text-base font-bold transition-colors duration-300 group-hover:text-[#A98968]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#171519]/45">
                      {item.desc}
                    </p>

                  </div>

                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#D9B896] transition-all duration-500 group-hover:w-full" />

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* PHILOSOPHY */}
        {/* ========================================================= */}

        <section
          id="philosophy"
          className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
        >

          <div className="relative overflow-hidden border border-[#171519]/10 bg-[#171519] px-7 py-16 text-[#F7F3EE] shadow-2xl sm:px-12 lg:px-20 lg:py-20">

            {/* Decorative circles */}

            <div className="pointer-events-none absolute right-[-120px] top-[-150px] h-[400px] w-[400px] rounded-full border border-[#D9B896]/15" />

            <div className="pointer-events-none absolute right-[-60px] top-[-90px] h-[280px] w-[280px] rounded-full border border-[#D9B896]/10" />

            <div className="relative max-w-3xl">

              <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D9B896]">
                The Barandly Philosophy
              </div>

              <blockquote className="mt-7 font-primary text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">

                “Your personal brand is not something you
                manufacture. It is something you learn to{" "}

                <span className="relative italic text-[#D9B896]">

                  articulate.

                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#D9B896]/30" />

                </span>

                ”

              </blockquote>

              <p className="mt-8 max-w-xl text-sm leading-7 text-[#F7F3EE]/50">
                The objective is not to create another version of
                yourself. It is to identify the patterns, values,
                and signals that make your existing identity
                strategically recognizable.
              </p>

            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* FINAL CTA */}
        {/* ========================================================= */}

        <section className="border-t border-[#171519]/10 bg-gradient-to-b from-[#F7F3EE] to-white">

          <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:px-8 lg:py-32">

            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#D9B896] bg-[#F7F3EE] transition-all duration-300 hover:scale-110 hover:shadow-lg">

              <Sparkles className="h-5 w-5 text-[#A98968]" />

            </div>

            <div className="mt-8 font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A98968]">
              Begin the discovery
            </div>

            <h2 className="mx-auto mt-5 max-w-3xl font-primary text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">

              Your brand already has a DNA.
              <br />

              <span className="italic text-[#A98968]">
                Discover it.
              </span>

            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#171519]/60">
              Start your assessment and receive a structured
              interpretation of the identity behind your influence.
            </p>

            <div className="mt-9">

              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="group inline-flex h-14 items-center gap-4 bg-[#171519] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7F3EE] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#29272A] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B896]"
              >

                <span>
                  {isSignedIn
                    ? "Open My Dashboard"
                    : "Begin Diagnostic Assessment"}
                </span>

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="border-t border-[#171519]/10 bg-[#F7F3EE]">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center transition-transform duration-300 hover:scale-110">

              <img
                src="/LOGO.png"
                alt="Barandly"
                className="h-full w-full object-contain"
                loading="lazy"
              />

            </div>

            <div>

              <div className="bg-gradient-to-r from-[#171519] to-[#4A4349] bg-clip-text text-[10px] font-bold uppercase tracking-[0.18em] text-transparent">
                BARANDLY
              </div>

              <div className="text-[8px] uppercase tracking-[0.15em] text-[#171519]/40">
                Strategic Personal Brand Architecture
              </div>

            </div>

          </div>

          <div className="text-[9px] uppercase tracking-[0.15em] text-[#171519]/35">
            Confidential Client Intelligence • © 2026 Barandly
          </div>

        </div>

      </footer>

      {/* ========================================================= */}
      {/* ANIMATIONS */}
      {/* ========================================================= */}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes softPulse {
          0%,
          100% {
            opacity: 0.25;
          }

          50% {
            opacity: 0.55;
          }
        }

        @keyframes softPing {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }

          70% {
            transform: scale(2);
            opacity: 0;
          }

          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }

        .animate-soft-pulse {
          animation: softPulse 4s ease-in-out infinite;
        }

        .animate-soft-ping {
          animation: softPing 2.5s ease-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-float,
          .animate-spin-slow,
          .animate-soft-pulse,
          .animate-soft-ping {
            animation: none;
          }
        }
      `}</style>

    </div>
  );
}
