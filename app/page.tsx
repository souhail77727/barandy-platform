import Link from "next/link";
import { auth } from "@/auth";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Circle,
  Compass,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  const isSignedIn = !!session?.user?.id;
  const userName = session?.user?.name?.split(" ")[0] || "Client";
  const primaryHref = isSignedIn ? "/dashboard" : "/sign-up";

  const brandElements = [
    {
      number: "01",
      title: "Identity & Values",
      description:
        "The qualities and principles you want your professional identity to express.",
    },
    {
      number: "02",
      title: "Purpose & Vision",
      description:
        "The contribution you want to make and the future you want to build.",
    },
    {
      number: "03",
      title: "Ikigai",
      description:
        "A synthesis of what matters to you, what you do well, and where your work can make a difference.",
    },
    {
      number: "04",
      title: "Archetypes",
      description:
        "Primary and secondary archetypes that help give your brand a recognizable character.",
    },
    {
      number: "05",
      title: "Voice & Perception",
      description:
        "A communication tone and a clearer picture of how you want people to perceive you.",
    },
    {
      number: "06",
      title: "Color Intelligence",
      description:
        "A considered color direction connected to the values you selected.",
    },
    {
      number: "07",
      title: "Strategic Positioning",
      description:
        "A practical foundation for your positioning, elevator pitch, content pillars, and strategic guidance.",
    },
  ];

  const principles = [
    {
      number: "01",
      icon: Compass,
      title: "Start with the person",
      description:
        "The process begins with your identity and perspective, giving your brand a meaningful foundation.",
    },
    {
      number: "02",
      icon: Palette,
      title: "Connect strategy and expression",
      description:
        "Your values, voice, archetypes, and visual direction come together in one coherent picture.",
    },
    {
      number: "03",
      icon: ShieldCheck,
      title: "Keep your work private",
      description:
        "Your assessment and Brand DNA are part of a private client experience.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F3EE] text-[#171519] selection:bg-[#D9B896] selection:text-[#171519]">
      {/* ========================================================= */}
      {/* FIXED BRAND NAVIGATION                                    */}
      {/* ========================================================= */}

      <aside className="fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        <a
          href="#top"
          aria-label="Home"
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#171519]/5 bg-[#ECE9DF] transition-all duration-300 hover:bg-[#171519] hover:text-[#F7F3EE]"
        >
          <span className="text-[11px] font-black tracking-[-0.08em] transition-transform duration-500 group-hover:scale-110">
            B
          </span>
        </a>

        <a
          href="#why"
          aria-label="Why Barandy"
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#171519]/5 bg-[#ECE9DF] transition-all duration-300 hover:bg-[#171519] hover:text-[#F7F3EE]"
        >
          <Circle className="h-5 w-5 transition-transform duration-300 group-hover:scale-75" />
        </a>

        <a
          href="#method"
          aria-label="How it works"
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#171519]/5 bg-[#ECE9DF] transition-all duration-300 hover:bg-[#171519] hover:text-[#F7F3EE]"
        >
          <Compass className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
        </a>

        <a
          href="#brand-dna"
          aria-label="Brand DNA"
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#171519]/5 bg-[#ECE9DF] transition-all duration-300 hover:bg-[#171519] hover:text-[#F7F3EE]"
        >
          <Target className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </a>

        <a
          href="#start"
          aria-label="Start assessment"
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#171519]/5 bg-[#ECE9DF] transition-all duration-300 hover:bg-[#171519] hover:text-[#F7F3EE]"
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
      </aside>

      {/* ========================================================= */}
      {/* HEADER                                                     */}
      {/* ========================================================= */}

      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto flex h-[82px] max-w-[1700px] items-center justify-between px-6 sm:px-10 lg:px-16">
          <Link
            href="/"
            id="top"
            aria-label="Barandy home"
            className="group flex items-center gap-3"
          >
            <div className="h-10 w-10 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/LOGO.png"
                alt="Barandy"
                className="h-full w-full object-contain"
                loading="eager"
              />
            </div>

            <div className="hidden sm:block">
              <div className="bg-gradient-to-r from-[#171519] to-[#4A4349] bg-clip-text font-sans text-sm font-extrabold tracking-[0.18em] text-transparent">
                BARANDY
              </div>

              <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.22em] text-[#171519]/45">
                Brand Architecture
              </div>
            </div>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 lg:flex"
          >
            <a
              href="#why"
              className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#171519]/55 transition-colors hover:text-[#171519]"
            >
              Why Barandy
            </a>

            <a
              href="#method"
              className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#171519]/55 transition-colors hover:text-[#171519]"
            >
              How It Works
            </a>

            <a
              href="#brand-dna"
              className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#171519]/55 transition-colors hover:text-[#171519]"
            >
              Your Brand DNA
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn ? (
              <>
                <span className="hidden font-sans text-xs text-[#171519]/55 sm:block">
                  Welcome, {userName}
                </span>

                <Link
                  href="/dashboard"
                  className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#171519] px-5 font-sans text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#332E31]"
                >
                  Dashboard

                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden px-3 py-3 font-sans text-[9px] font-bold uppercase tracking-[0.13em] text-[#171519]/60 transition-opacity hover:opacity-50 sm:block"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#171519] px-5 font-sans text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#332E31]"
                >
                  Get Started

                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE NAV */}
        <nav
          aria-label="Page sections"
          className="border-t border-[#171519]/5 bg-[#F7F3EE]/90 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-2.5 sm:px-10">
            <a
              href="#why"
              className="shrink-0 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-[#171519]/60"
            >
              Why Barandy
            </a>

            <a
              href="#method"
              className="shrink-0 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-[#171519]/60"
            >
              How It Works
            </a>

            <a
              href="#brand-dna"
              className="shrink-0 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-[#171519]/60"
            >
              Brand DNA
            </a>

            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="shrink-0 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-[#171519]/60"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* ======================================================= */}
        {/* HERO                                                     */}
        {/* ======================================================= */}

        <section className="relative min-h-screen overflow-hidden px-6 pt-28 sm:px-10 lg:px-20">
          {/* LARGE BARANDY LOGO WATERMARK */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[46%] z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.035]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[38rem] w-[38rem] object-contain grayscale"
            />
          </div>

          {/* SECOND OFFSET WATERMARK */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[12rem] bottom-[4%] z-0 opacity-[0.025]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[30rem] w-[30rem] object-contain grayscale"
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[13%] top-[18%] z-0 h-3 w-3 rounded-full bg-[#D9D9CF]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] top-[35%] z-0 hidden h-px w-24 bg-[#171519]/15 lg:block"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[7.5%] top-[34.5%] z-0 hidden h-4 w-4 rounded-full border border-[#171519]/15 lg:block"
          >
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#171519]" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15rem] top-[12rem] z-0 h-[38rem] w-[38rem] rounded-full border border-[#A98968]/15"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[10rem] top-[17rem] z-0 h-[28rem] w-[28rem] rounded-full border border-[#171519]/[0.06]"
          />

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-[1700px] flex-col justify-between pb-12">
            <div className="pt-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#A98968]" />

                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#171519]/55">
                  Personal Brand Intelligence
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[1500px] py-14 text-center">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 -translate-x-1/2 text-[#A98968]/60"
              >
                <Sparkles className="h-6 w-6 animate-[spin_16s_linear_infinite]" />
              </div>

              <h1 className="font-sans text-[clamp(4.3rem,11vw,11.8rem)] font-extrabold leading-[0.77] tracking-[-0.08em]">
                Your brand
                <br />
                has a{" "}
                <span className="relative inline-block">
                  DNA
                  <span className="absolute -right-3 -top-1 text-[0.15em] font-black text-[#A98968] sm:-right-5">
                    ✦
                  </span>
                </span>
                .
              </h1>
            </div>

            <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto_1fr]">
              <div className="hidden lg:block">
                <div className="mb-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#171519]/35">
                  01 / 04
                </div>

                <div className="h-px w-28 bg-[#171519]/20" />

                <div className="mt-4 max-w-[170px] font-sans text-[9px] uppercase leading-5 tracking-[0.1em] text-[#171519]/45">
                  Identity
                  <br />
                  Strategy
                  <br />
                  Expression
                </div>
              </div>

              <div className="mx-auto max-w-[620px] text-center">
                <p className="font-sans text-[18px] leading-[1.3] tracking-[-0.025em] sm:text-[21px] lg:text-[24px]">
                  Barandy decodes the architecture behind your personal brand —
                  turning your identity, values, archetype and perception into a
                  strategic system.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href={primaryHref}
                    className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#171519] px-7 font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-1 hover:bg-[#332E31]"
                  >
                    {isSignedIn
                      ? "Open My Dashboard"
                      : "Start Your Assessment"}

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="#method"
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#171519]/20 px-7 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#171519]/70 transition-all duration-300 hover:bg-[#171519] hover:text-[#F7F3EE]"
                  >
                    Explore the process

                    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                  </a>
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3">
                  <span className="inline-flex items-center gap-2 font-sans text-[8px] font-bold uppercase tracking-[0.13em] text-[#171519]/45">
                    <Check className="h-3.5 w-3.5 text-[#A98968]" />
                    Built around your answers
                  </span>

                  <span className="inline-flex items-center gap-2 font-sans text-[8px] font-bold uppercase tracking-[0.13em] text-[#171519]/45">
                    <Check className="h-3.5 w-3.5 text-[#A98968]" />
                    Private client experience
                  </span>
                </div>
              </div>

              <div className="hidden justify-end lg:flex">
                <div className="text-right">
                  <div className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-[#171519]/35">
                    Built around
                  </div>

                  <div className="mt-1 font-sans text-[10px] font-bold uppercase tracking-[0.08em]">
                    Your identity
                  </div>

                  <div className="font-sans text-[10px] font-bold uppercase tracking-[0.08em]">
                    Your perspective
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-9 right-8 hidden flex-col items-center gap-3 lg:flex">
              <span className="font-sans text-[8px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-rl]">
                Scroll
              </span>

              <div className="h-14 w-px bg-[#171519]/20" />
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* IDEA                                                     */}
        {/* ======================================================= */}

        <section className="relative overflow-hidden border-y border-[#171519]/10 px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
          {/* SUBTLE LOGO */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-7rem] top-1/2 z-0 -translate-y-1/2 opacity-[0.025]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[25rem] w-[25rem] object-contain grayscale"
            />
          </div>

          <div className="relative z-10 mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.65fr_2fr] lg:items-center">
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.24em] text-[#171519]/40">
                The idea
              </span>

              <div className="mt-5 h-px w-12 bg-[#A98968]" />
            </div>

            <h2 className="max-w-[1100px] font-sans text-[clamp(2.8rem,6.3vw,7rem)] font-extrabold leading-[0.86] tracking-[-0.065em]">
              A personal brand is not just how you look.
              <span className="font-serif font-normal italic text-[#A98968]">
                {" "}
                It is how you are perceived.
              </span>
            </h2>
          </div>
        </section>

        {/* ======================================================= */}
        {/* WHY BARANDY                                               */}
        {/* ======================================================= */}

        <section
          id="why"
          className="relative scroll-mt-28 overflow-hidden bg-[#171519] text-[#F7F3EE]"
        >
          {/* INVERTED BARANDY LOGO */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-12rem] top-1/2 z-0 -translate-y-1/2 opacity-[0.055]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[40rem] w-[40rem] object-contain brightness-0 invert"
            />
          </div>

          {/* SECOND LOGO */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] z-0 opacity-[0.025]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[28rem] w-[28rem] object-contain brightness-0 invert"
            />
          </div>

          <div className="relative z-10 mx-auto grid max-w-[1500px] gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:px-20 lg:py-36">
            <div>
              <p className="flex items-center gap-3 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#F7F3EE]/45">
                <span className="h-px w-9 bg-[#D9B896]" />
                Why Barandy
              </p>

              <h2 className="mt-8 max-w-2xl font-sans text-[clamp(3.5rem,7vw,7.5rem)] font-extrabold leading-[0.8] tracking-[-0.07em]">
                Your brand is
                <br />
                more than
                <br />
                <span className="font-serif font-normal italic text-[#D9B896]">
                  aesthetics.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-between gap-14 lg:py-3">
              <p className="max-w-2xl font-sans text-base leading-8 text-[#F7F3EE]/65 sm:text-lg sm:leading-9">
                It is the impression created by your choices, values,
                communication, and the way you show up. When those parts feel
                disconnected, it becomes harder to explain what makes your
                perspective distinct.
              </p>

              <div className="grid gap-8 border-t border-[#F7F3EE]/15 pt-8 sm:grid-cols-3 sm:gap-6">
                {principles.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.number}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[#D9B896]" />

                        <span className="font-mono text-[8px] tracking-[0.18em] text-[#D9B896]/70">
                          {item.number}
                        </span>
                      </div>

                      <h3 className="mt-5 font-sans text-[11px] font-bold uppercase leading-5 tracking-[0.08em]">
                        {item.title}
                      </h3>

                      <p className="mt-3 max-w-xs font-sans text-xs leading-6 text-[#F7F3EE]/50">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* HOW IT WORKS                                             */}
        {/* ======================================================= */}

        <section
          id="method"
          className="relative scroll-mt-28 overflow-hidden border-b border-[#171519]/10 bg-[#EDE4D9]"
        >
          {/* SIDE LOGO */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-8rem] right-[-10rem] z-0 opacity-[0.035]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[36rem] w-[36rem] object-contain grayscale"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-24 sm:px-10 lg:px-20 lg:py-36">
            <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <div>
                <p className="flex items-center gap-3 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#171519]/45">
                  <span className="h-px w-9 bg-[#A98968]" />
                  How It Works
                </p>

                <h2 className="mt-8 max-w-xl font-sans text-[clamp(3.2rem,6vw,6.5rem)] font-extrabold leading-[0.82] tracking-[-0.065em]">
                  Reflection
                  <br />
                  first.
                  <br />
                  <span className="font-serif font-normal italic text-[#8F6D4D]">
                    Direction next.
                  </span>
                </h2>

                <p className="mt-8 max-w-md font-sans text-sm leading-7 text-[#171519]/60">
                  The assessment helps bring the person behind your brand into
                  focus. Your responses shape a Brand DNA profile that connects
                  identity with a clearer way to express it.
                </p>
              </div>

              <div className="border-t border-[#171519]/15">
                {[
                  {
                    number: "01",
                    title: "Reflect",
                    description:
                      "Answer guided questions about the values, motivations, ambitions, and perspective behind your work.",
                  },
                  {
                    number: "02",
                    title: "Find the pattern",
                    description:
                      "Your answers inform a connected view of your identity, positioning, voice, archetypes, and visual direction.",
                  },
                  {
                    number: "03",
                    title: "Build with clarity",
                    description:
                      "Your Brand DNA becomes a strategic foundation for expressing your personal brand with greater consistency.",
                  },
                ].map((item) => (
                  <article
                    key={item.number}
                    className="group grid gap-5 border-b border-[#171519]/15 py-9 transition-all duration-300 hover:px-3 sm:grid-cols-[80px_1fr_1.5fr] sm:items-start"
                  >
                    <span className="font-mono text-[9px] tracking-[0.18em] text-[#8F6D4D]">
                      {item.number}
                    </span>

                    <h3 className="font-serif text-3xl italic tracking-[-0.03em] sm:text-4xl">
                      {item.title}
                    </h3>

                    <p className="max-w-md font-sans text-sm leading-7 text-[#171519]/55">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-[#171519]/15 pt-8 sm:flex-row sm:items-center">
              <p className="max-w-lg font-sans text-xs leading-6 text-[#171519]/50">
                A structured reflection followed by a personal brand
                foundation designed around your answers.
              </p>

              <Link
                href={primaryHref}
                className="group inline-flex items-center gap-3 border-b border-[#171519]/35 pb-2 font-sans text-[9px] font-extrabold uppercase tracking-[0.14em] transition-colors hover:border-[#8F6D4D]"
              >
                {isSignedIn
                  ? "Continue to Your Dashboard"
                  : "Begin Your Assessment"}

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* INTENTIONAL                                              */}
        {/* ======================================================= */}

        <section className="relative overflow-hidden bg-[#171519] px-6 py-24 text-[#F7F3EE] sm:px-10 lg:px-20 lg:py-36">
          {/* LARGE INVERTED LOGO */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.035]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[46rem] w-[46rem] object-contain brightness-0 invert"
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-9rem] top-1/2 z-0 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-[#F7F3EE]/[0.07]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] top-[20%] z-0 h-20 w-20 rounded-full border border-[#C8A256]/35"
          />

          <div className="relative z-10 mx-auto max-w-[1500px]">
            <div className="mb-16 flex items-center justify-between">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.24em] text-[#F7F3EE]/40">
                The Barandy principle
              </span>

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#C8A256]">
                Brand DNA™
              </span>
            </div>

            <div className="grid gap-16 lg:grid-cols-[1.5fr_0.7fr] lg:items-end">
              <h2 className="font-sans text-[clamp(4.5rem,10vw,11rem)] font-extrabold leading-[0.73] tracking-[-0.08em]">
                Be
                <br />
                <span className="text-[#C8A256]">intentional.</span>
              </h2>

              <div className="max-w-[460px]">
                <p className="font-sans text-lg leading-8 text-[#F7F3EE]/60 sm:text-xl">
                  A strong personal brand is the consistency between what you
                  believe, what you communicate, how you behave, and how others
                  experience you.
                </p>

                <div className="mt-10 h-px w-full bg-[#F7F3EE]/15" />

                <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-[#F7F3EE]/35">
                  Identity → Perception → Positioning
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* BRAND DNA                                                */}
        {/* ======================================================= */}

        <section
          id="brand-dna"
          className="relative scroll-mt-28 overflow-hidden bg-[#F7F3EE]"
        >
          {/* LARGE WATERMARK */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-14rem] top-[24%] z-0 opacity-[0.035]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[45rem] w-[45rem] object-contain grayscale"
            />
          </div>

          {/* SMALL WATERMARK */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] z-0 opacity-[0.025]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[28rem] w-[28rem] object-contain grayscale"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-24 sm:px-10 lg:px-20 lg:py-36">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.65fr] lg:gap-20">
              <div>
                <p className="flex items-center gap-3 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#171519]/45">
                  <span className="h-px w-9 bg-[#A98968]" />
                  Inside Your Brand DNA
                </p>

                <h2 className="mt-8 max-w-[1000px] font-sans text-[clamp(3.4rem,7vw,7.5rem)] font-extrabold leading-[0.8] tracking-[-0.07em]">
                  Seven layers.
                  <br />
                  <span className="font-serif font-normal italic text-[#A98968]">
                    One identity.
                  </span>
                </h2>
              </div>

              <p className="max-w-xl pb-2 font-sans text-sm leading-7 text-[#171519]/55">
                Your profile brings together the foundations of your identity
                and a considered direction for expressing your personal brand.
              </p>
            </div>

            <div className="mt-20 grid border-l border-t border-[#171519]/[0.12] sm:grid-cols-2 lg:grid-cols-4">
              {brandElements.map((item, index) => (
                <article
                  key={item.number}
                  className={`group relative min-h-[225px] border-b border-r border-[#171519]/[0.12] p-6 transition-all duration-300 hover:bg-white/65 sm:p-7 ${
                    index === 0 || index === 6
                      ? "bg-[#EDE4D9]/55"
                      : "bg-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[0.18em] text-[#8F6D4D]">
                      {item.number}
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-[#A98968]/60 transition-transform duration-300 group-hover:scale-150" />
                  </div>

                  <h3 className="mt-10 max-w-[210px] font-sans text-[11px] font-extrabold uppercase leading-5 tracking-[0.08em]">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[250px] font-sans text-xs leading-6 text-[#171519]/50">
                    {item.description}
                  </p>

                  <ArrowUpRight className="absolute bottom-6 right-6 h-4 w-4 opacity-20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" />
                </article>
              ))}
            </div>

            <div className="mt-16 grid border-y border-[#171519]/15 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["08", "Guided Questions"],
                ["04", "Core Identity Pillars"],
                ["05", "Color Intelligence Layers"],
                ["01", "Strategic Brand Dossier"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="border-b border-[#171519]/15 px-6 py-9 last:border-b-0 sm:px-7 lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <div className="font-sans text-5xl font-extrabold tracking-[-0.06em]">
                    {number}
                  </div>

                  <div className="mt-3 font-sans text-[8px] font-bold uppercase tracking-[0.16em] text-[#171519]/40">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="max-w-lg font-sans text-xs leading-6 text-[#171519]/50">
                Seven connected dimensions. One clearer foundation for the way
                you present your work.
              </p>

              <Link
                href={primaryHref}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#171519] px-7 font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#332E31] sm:w-auto"
              >
                {isSignedIn
                  ? "Go to Your Dashboard"
                  : "Discover Your Brand"}

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* FINAL CTA                                                */}
        {/* ======================================================= */}

        <section
          id="start"
          className="relative overflow-hidden border-t border-[#171519]/10 bg-white px-6 py-24 sm:px-10 lg:px-20 lg:py-36"
        >
          {/* CENTRAL LOGO WATERMARK */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.035]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[40rem] w-[40rem] object-contain grayscale"
            />
          </div>

          {/* CORNER LOGO */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[9rem] -right-[7rem] z-0 opacity-[0.025]"
          >
            <img
              src="/LOGO.png"
              alt=""
              className="h-[30rem] w-[30rem] object-contain grayscale"
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] top-[17%] z-0 h-3 w-3 rounded-full bg-[#C8A256]"
          />

          <div className="relative z-10 mx-auto max-w-[1500px]">
            <div className="font-sans text-[9px] font-bold uppercase tracking-[0.24em] text-[#8F6D4D]">
              Your next layer
            </div>

            <h2 className="mt-8 max-w-[1350px] font-sans text-[clamp(4rem,10vw,11rem)] font-extrabold leading-[0.73] tracking-[-0.08em]">
              Make your
              <br />
              identity
              <br />
              <span className="font-serif font-normal italic text-[#A98968]">
                intentional.
              </span>
            </h2>

            <div className="mt-16 grid gap-10 border-t border-[#171519]/15 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="max-w-[580px] font-sans text-lg leading-8 text-[#171519]/55 sm:text-xl">
                  Start with what makes your perspective yours. Build from
                  there.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#171519]/35">
                    Identity
                  </span>

                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#171519]/35">
                    Strategy
                  </span>

                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#171519]/35">
                    Expression
                  </span>
                </div>
              </div>

              <Link
                href={primaryHref}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-4 rounded-full bg-[#171519] px-8 font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F7F3EE] transition-all duration-300 hover:-translate-y-1 hover:bg-[#332E31] lg:w-auto"
              >
                {isSignedIn
                  ? "Open My Dashboard"
                  : "Begin Your Assessment"}

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* FOOTER                                                     */}
      {/* ========================================================= */}

      <footer className="relative overflow-hidden border-t border-[#171519]/10 bg-[#F7F3EE]">
        {/* FOOTER LOGO WATERMARK */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-5rem] top-1/2 z-0 -translate-y-1/2 opacity-[0.025]"
        >
          <img
            src="/LOGO.png"
            alt=""
            className="h-[20rem] w-[20rem] object-contain grayscale"
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-8 px-6 py-10 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-20">
          <Link
            href="/"
            aria-label="Barandy home"
            className="group flex items-center gap-3"
          >
            <div className="h-10 w-10 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/LOGO.png"
                alt="Barandy"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <div className="font-sans text-sm font-extrabold tracking-[0.18em]">
                BARANDY
              </div>

              <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.22em] text-[#171519]/40">
                Personal Brand Intelligence
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-2 md:text-right">
            <span className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-[#171519]/35">
              Brand Architecture
            </span>

            <span className="font-sans text-[9px] text-[#171519]/40">
              © {new Date().getFullYear()} Barandy. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* GLOBAL MOTION                                             */}
      {/* ========================================================= */}

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}