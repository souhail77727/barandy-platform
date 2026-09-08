"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  DollarSign,
  Menu,
  RefreshCw,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

type AnalyticsData = {
  success: boolean;

  kpis: {
    totalAccounts: number;
    newAccountsThisMonth: number;
    newAccountsLastMonth: number;

    assessmentsStarted: number;
    assessmentsCompleted: number;
    assessmentsInProgress: number;
    assessmentsNotStarted: number;

    clientsWithoutAssessment: number;

    paidClients: number;

    totalRevenue: number;
    revenueThisMonth: number;

    developerProfit: number;
    developerProfitThisMonth: number;

    barandyRevenue: number;

    accountToAssessment: number;
    assessmentCompletion: number;
    completionToPayment: number;
    accountToPayment: number;
  };

  charts: {
    accountGrowth: {
      month: string;
      count: number;
    }[];

    revenueGrowth: {
      month: string;
      revenue: number;
    }[];

    accountCreationByHour: {
      hour: number;
      count: number;
    }[];

    assessmentActivityByHour: {
      hour: number;
      count: number;
    }[];
  };

  peaks: {
    accountCreationHour: {
      hour: number;
      count: number;
    };

    assessmentHour: {
      hour: number;
      count: number;
    };
  };

  recent: {
    users: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      createdAt: string;
    }[];

    assessments: {
      id: string;
      status: string;
      progress: number;
      startedAt: string | null;
      updatedAt: string;
      user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
    }[];

    payments: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      createdAt: string;
      user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
    }[];
  };
};

type Range = "7D" | "30D" | "3M" | "6M" | "ALL";

const ranges: Range[] = ["7D", "30D", "3M", "6M", "ALL"];

function formatMoney(amount: number) {
  return `${amount.toLocaleString("fr-FR")} TND`;
}

function formatMonth(value: string) {
  const [year, month] = value.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diff = Math.max(
    0,
    now.getTime() - date.getTime()
  );

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function getUserName(user: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
}) {
  const name = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ");

  return name || user.email || "Unknown client";
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function calculateGrowth(
  current: number,
  previous: number
) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(
    ((current - previous) / previous) * 100
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58D59]">
        {eyebrow}
      </p>

      <h2 className="mt-1.5 font-primary text-xl font-semibold tracking-tight text-[#171519]">
        {title}
      </h2>

      {description && (
        <p className="mt-1.5 text-xs leading-relaxed text-[#171519]/45">
          {description}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  dark = false,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: React.ElementType;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[22px] border p-5 transition-all duration-300 hover:-translate-y-0.5",
        dark
          ? "border-white/10 bg-[#171519] text-white shadow-[0_16px_50px_rgba(23,21,25,0.12)]"
          : "border-[#171519]/7 bg-white text-[#171519] shadow-[0_12px_40px_rgba(23,21,25,0.035)]",
      ].join(" ")}
    >
      <div
        className={[
          "absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl",
          dark ? "bg-[#C8A256]/10" : "bg-[#D9B896]/10",
        ].join(" ")}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-xl",
            dark
              ? "bg-white/8 text-[#C8A256]"
              : "bg-[#F8F5F1] text-[#171519]/65",
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </div>

        {detail && (
          <span
            className={[
              "rounded-full px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-wider",
              dark
                ? "bg-[#C8A256]/10 text-[#C8A256]"
                : "bg-[#F8F5F1] text-[#171519]/45",
            ].join(" ")}
          >
            {detail}
          </span>
        )}
      </div>

      <div className="relative mt-6">
        <p
          className={[
            "font-mono text-[8px] font-semibold uppercase tracking-[0.18em]",
            dark ? "text-white/40" : "text-[#171519]/40",
          ].join(" ")}
        >
          {label}
        </p>

        <p className="mt-2 text-[27px] font-semibold tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#171519]/10 bg-[#F8F5F1]/40">
      <div className="text-center">
        <Activity className="mx-auto h-5 w-5 text-[#171519]/20" />

        <p className="mt-3 text-xs text-[#171519]/40">
          {message}
        </p>
      </div>
    </div>
  );
}

function ActivityRow({
  initials,
  title,
  subtitle,
  time,
  icon: Icon,
  iconClass,
}: {
  initials?: string;
  title: string;
  subtitle: string;
  time: string;
  icon?: React.ElementType;
  iconClass?: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl px-2 py-3 transition hover:bg-[#F8F5F1]">
      {initials ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171519] font-mono text-[8px] font-bold text-[#C8A256]">
          {initials}
        </div>
      ) : (
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F1]",
            iconClass || "",
          ].join(" ")}
        >
          {Icon && <Icon className="h-4 w-4" />}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[#171519]">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-[#171519]/40">
          {subtitle}
        </p>
      </div>

      <span className="shrink-0 font-mono text-[8px] text-[#171519]/30">
        {time}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [range, setRange] =
    useState<Range>("ALL");

  const [activeChart, setActiveChart] =
    useState<"accounts" | "revenue">(
      "accounts"
    );

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/admin/analytics",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "You are not authenticated."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You do not have permission to access the admin dashboard."
          );
        }

        throw new Error(
          "Unable to load analytics."
        );
      }

      const result =
        (await response.json()) as AnalyticsData;

      setData(result);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const filteredAccountGrowth =
    useMemo(() => {
      if (!data) return [];

      if (range === "ALL") {
        return data.charts.accountGrowth;
      }

      const months =
        range === "3M"
          ? 3
          : range === "6M"
            ? 6
            : range === "30D"
              ? 2
              : 1;

      return data.charts.accountGrowth.slice(
        -months
      );
    }, [data, range]);

  const filteredRevenueGrowth =
    useMemo(() => {
      if (!data) return [];

      if (range === "ALL") {
        return data.charts.revenueGrowth;
      }

      const months =
        range === "3M"
          ? 3
          : range === "6M"
            ? 6
            : range === "30D"
              ? 2
              : 1;

      return data.charts.revenueGrowth.slice(
        -months
      );
    }, [data, range]);

  const funnelData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Accounts",
        value: data.kpis.totalAccounts,
        fill: "#171519",
      },
      {
        name: "Assessment Started",
        value: data.kpis.assessmentsStarted,
        fill: "#75614B",
      },
      {
        name: "Completed",
        value: data.kpis.assessmentsCompleted,
        fill: "#A88762",
      },
      {
        name: "Paid",
        value: data.kpis.paidClients,
        fill: "#C8A256",
      },
    ];
  }, [data]);

  const accountGrowthPercentage =
    data
      ? calculateGrowth(
          data.kpis.newAccountsThisMonth,
          data.kpis.newAccountsLastMonth
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-5 py-8 md:px-8">
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-8 w-36 rounded bg-[#171519]/8" />
            <div className="h-9 w-24 rounded-xl bg-[#171519]/8" />
          </div>

          <div className="mt-12">
            <div className="h-3 w-32 rounded bg-[#171519]/8" />
            <div className="mt-4 h-12 w-96 max-w-full rounded bg-[#171519]/8" />
            <div className="mt-3 h-4 w-[500px] max-w-full rounded bg-[#171519]/8" />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-[22px] bg-white"
                />
              )
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="h-[420px] rounded-[28px] bg-white" />
            <div className="h-[420px] rounded-[28px] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F1] px-5">
        <div className="w-full max-w-md rounded-[28px] border border-[#171519]/8 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8EAEA]">
            <XCircle className="h-5 w-5 text-[#8C4141]" />
          </div>

          <h1 className="mt-5 font-primary text-2xl font-semibold">
            Dashboard unavailable
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[#171519]/50">
            {error ||
              "No analytics data is available."}
          </p>

          <button
            onClick={loadAnalytics}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#171519] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#302D32]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { kpis } = data;

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-[#171519]/30 backdrop-blur-sm lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-[#F8F5F1] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <img
                src="/LOGO.png"
                alt="Barandy"
                className="h-9 w-auto object-contain"
              />

              <button
                onClick={() => setMobileMenu(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 space-y-2">
              <Link
                href="/admin"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="flex items-center justify-between rounded-xl bg-[#171519] px-4 py-3 text-xs font-semibold text-white"
              >
                Dashboard
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/admin/clients"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold text-[#171519]/60 hover:bg-white"
              >
                Clients
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TOP NAV */}
      <header className="sticky top-0 z-40 border-b border-[#171519]/7 bg-[#F8F5F1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="flex items-center"
            >
              <img
                src="/LOGO.png"
                alt="Barandy"
                className="h-9 w-auto max-w-[145px] object-contain"
              />
            </Link>

            <div className="hidden h-5 w-px bg-[#171519]/10 lg:block" />

            <nav className="hidden items-center gap-1 lg:flex">
              <Link
                href="/admin"
                className="rounded-xl bg-[#171519] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white"
              >
                Overview
              </Link>

              <Link
                href="/admin/clients"
                className="rounded-xl px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#171519]/45 transition hover:bg-white hover:text-[#171519]"
              >
                Clients
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAnalytics}
              className="flex h-9 items-center gap-2 rounded-xl border border-[#171519]/8 bg-white px-3 text-[9px] font-semibold uppercase tracking-wider text-[#171519]/55 transition hover:bg-[#EEE8E1]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <Link
              href="/admin/clients"
              className="hidden h-9 items-center gap-2 rounded-xl bg-[#171519] px-3.5 text-[9px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#302D32] sm:flex"
            >
              <Users className="h-3.5 w-3.5" />
              Clients
            </Link>

            <button
              onClick={() =>
                setMobileMenu(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#171519] px-6 py-8 text-white shadow-[0_20px_70px_rgba(23,21,25,0.12)] md:px-9 md:py-10">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#C8A256]/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A256]" />

                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C8A256]">
                  Barandy command center
                </span>
              </div>

              <h1 className="mt-4 max-w-3xl font-primary text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                Know what is happening
                <span className="text-[#C8A256]">
                  {" "}
                  behind the platform.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/50">
                A real-time view of acquisition,
                assessment behavior, conversion
                and commercial performance.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C8A256]" />
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/55">
                    System operational
                  </span>
                </div>

                <span className="font-mono text-[8px] uppercase tracking-wider text-white/25">
                  Updated live
                </span>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
                    Business pulse
                  </p>

                  <TrendingUp className="h-4 w-4 text-[#C8A256]" />
                </div>

                <div className="mt-5 flex items-end justify-between gap-5">
                  <div>
                    <p className="text-3xl font-semibold">
                      {formatMoney(
                        kpis.revenueThisMonth
                      )}
                    </p>

                    <p className="mt-1 text-[10px] text-white/35">
                      Revenue this month
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold text-[#C8A256]">
                      {kpis.accountToPayment}%
                    </p>

                    <p className="mt-1 text-[10px] text-white/35">
                      Account → payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PERIOD */}
        <section className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.22em] text-[#B58D59]">
              Performance overview
            </p>

            <p className="mt-1 text-xs text-[#171519]/40">
              Select the period used for trend
              visualization.
            </p>
          </div>

          <div className="flex w-fit items-center rounded-2xl border border-[#171519]/7 bg-white p-1 shadow-sm">
            {ranges.map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={[
                  "rounded-xl px-3 py-2 font-mono text-[8px] font-semibold tracking-wider transition",
                  range === item
                    ? "bg-[#171519] text-white shadow-sm"
                    : "text-[#171519]/40 hover:bg-[#F8F5F1]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* KPI GRID */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total accounts"
            value={kpis.totalAccounts}
            detail={`+${kpis.newAccountsThisMonth}`}
            icon={Users}
          />

          <MetricCard
            label="Paid clients"
            value={kpis.paidClients}
            detail={`${kpis.accountToPayment}% conversion`}
            icon={CreditCard}
            dark
          />

          <MetricCard
            label="Assessments completed"
            value={kpis.assessmentsCompleted}
            detail={`${kpis.assessmentCompletion}%`}
            icon={CheckCircle2}
          />

          <MetricCard
            label="Total revenue"
            value={formatMoney(kpis.totalRevenue)}
            detail={`${formatMoney(kpis.revenueThisMonth)} MTD`}
            icon={DollarSign}
          />
        </section>

        {/* SECONDARY METRICS */}
        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="New accounts"
            value={`+${kpis.newAccountsThisMonth}`}
            detail={`${accountGrowthPercentage >= 0 ? "+" : ""}${accountGrowthPercentage}%`}
            icon={UserPlus}
          />

          <MetricCard
            label="Assessments started"
            value={kpis.assessmentsStarted}
            detail={`${kpis.accountToAssessment}% reach`}
            icon={Target}
          />

          <MetricCard
            label="In progress"
            value={kpis.assessmentsInProgress}
            detail="Active"
            icon={Activity}
          />

          <MetricCard
            label="Developer share"
            value={formatMoney(kpis.developerProfit)}
            detail="10%"
            icon={Wallet}
          />
        </section>

        {/* MAIN ANALYTICS */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          {/* GROWTH */}
          <div className="rounded-[30px] border border-[#171519]/7 bg-white p-5 shadow-[0_12px_40px_rgba(23,21,25,0.035)] md:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <SectionHeader
                eyebrow="Growth intelligence"
                title="Platform momentum"
                description="Understand how acquisition and revenue are evolving."
              />

              <div className="flex rounded-xl bg-[#F8F5F1] p-1">
                <button
                  onClick={() =>
                    setActiveChart("accounts")
                  }
                  className={[
                    "rounded-lg px-3 py-2 text-[8px] font-semibold uppercase tracking-wider transition",
                    activeChart === "accounts"
                      ? "bg-white text-[#171519] shadow-sm"
                      : "text-[#171519]/40",
                  ].join(" ")}
                >
                  Accounts
                </button>

                <button
                  onClick={() =>
                    setActiveChart("revenue")
                  }
                  className={[
                    "rounded-lg px-3 py-2 text-[8px] font-semibold uppercase tracking-wider transition",
                    activeChart === "revenue"
                      ? "bg-white text-[#171519] shadow-sm"
                      : "text-[#171519]/40",
                  ].join(" ")}
                >
                  Revenue
                </button>
              </div>
            </div>

            <div className="mt-6 h-[330px]">
              {activeChart === "accounts" ? (
                filteredAccountGrowth.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={
                        filteredAccountGrowth
                      }
                      margin={{
                        top: 10,
                        right: 5,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="accountFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#C8A256"
                            stopOpacity={0.28}
                          />
                          <stop
                            offset="100%"
                            stopColor="#C8A256"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        vertical={false}
                        stroke="#171519"
                        strokeOpacity={0.05}
                      />

                      <XAxis
                        dataKey="month"
                        tickFormatter={
                          formatMonth
                        }
                        tick={{
                          fontSize: 9,
                          fill: "#171519",
                          opacity: 0.4,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fontSize: 9,
                          fill: "#171519",
                          opacity: 0.4,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: 14,
                          border:
                            "1px solid rgba(23,21,25,0.08)",
                          boxShadow:
                            "0 12px 35px rgba(23,21,25,0.08)",
                          fontSize: 11,
                        }}
                        labelFormatter={(label) =>
                          formatMonth(
                            String(label)
                          )
                        }
                      />

                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#171519"
                        strokeWidth={2.5}
                        fill="url(#accountFill)"
                        name="Accounts"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="Not enough account history yet." />
                )
              ) : filteredRevenueGrowth.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={
                      filteredRevenueGrowth
                    }
                    margin={{
                      top: 10,
                      right: 5,
                      left: -10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#C8A256"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#C8A256"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      vertical={false}
                      stroke="#171519"
                      strokeOpacity={0.05}
                    />

                    <XAxis
                      dataKey="month"
                      tickFormatter={
                        formatMonth
                      }
                      tick={{
                        fontSize: 9,
                        fill: "#171519",
                        opacity: 0.4,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 9,
                        fill: "#171519",
                        opacity: 0.4,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `${Number(
                          value
                        ).toLocaleString(
                          "fr-FR"
                        )} TND`
                      }
                      contentStyle={{
                        borderRadius: 14,
                        border:
                          "1px solid rgba(23,21,25,0.08)",
                        boxShadow:
                          "0 12px 35px rgba(23,21,25,0.08)",
                        fontSize: 11,
                      }}
                      labelFormatter={(label) =>
                        formatMonth(
                          String(label)
                        )
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#171519"
                      strokeWidth={2.5}
                      fill="url(#revenueFill)"
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No revenue history yet." />
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#171519]/6 pt-5">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-wider text-[#171519]/35">
                  Monthly revenue
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatMoney(
                    kpis.revenueThisMonth
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="font-mono text-[8px] uppercase tracking-wider text-[#171519]/35">
                  New accounts
                </p>

                <p className="mt-1 text-lg font-semibold">
                  +{kpis.newAccountsThisMonth}
                </p>
              </div>
            </div>
          </div>

          {/* FUNNEL */}
          <div className="rounded-[30px] border border-[#171519]/7 bg-white p-5 shadow-[0_12px_40px_rgba(23,21,25,0.035)] md:p-7">
            <SectionHeader
              eyebrow="Conversion intelligence"
              title="Client journey"
              description="See where prospects move forward — and where they disappear."
            />

            <div className="mt-4 h-[270px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <FunnelChart>
                  <Tooltip />

                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList
                      position="right"
                      fill="#171519"
                      stroke="none"
                      dataKey="name"
                      fontSize={9}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 space-y-3">
              {[
                [
                  "Account → Assessment",
                  kpis.accountToAssessment,
                ],
                [
                  "Assessment → Completion",
                  kpis.assessmentCompletion,
                ],
                [
                  "Completion → Payment",
                  kpis.completionToPayment,
                ],
              ].map(
                ([label, value]) => (
                  <div
                    key={String(label)}
                    className="flex items-center justify-between border-t border-[#171519]/6 pt-3"
                  >
                    <span className="text-[9px] text-[#171519]/45">
                      {label}
                    </span>

                    <span className="font-mono text-[10px] font-bold">
                      {value}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* INSIGHT STRIP */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#171519]/7 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F1]">
                <UserPlus className="h-4 w-4" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-[#2D7040]" />
            </div>

            <p className="mt-5 font-mono text-[8px] uppercase tracking-wider text-[#171519]/35">
              Acquisition peak
            </p>

            <p className="mt-1 text-xl font-semibold">
              {formatHour(
                data.peaks.accountCreationHour
                  .hour
              )}
            </p>

            <p className="mt-1 text-[9px] text-[#171519]/40">
              {data.peaks.accountCreationHour.count}{" "}
              account registrations at peak
            </p>
          </div>

          <div className="rounded-[24px] border border-[#171519]/7 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F1]">
                <Target className="h-4 w-4" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-[#C8A256]" />
            </div>

            <p className="mt-5 font-mono text-[8px] uppercase tracking-wider text-[#171519]/35">
              Assessment peak
            </p>

            <p className="mt-1 text-xl font-semibold">
              {formatHour(
                data.peaks.assessmentHour.hour
              )}
            </p>

            <p className="mt-1 text-[9px] text-[#171519]/40">
              {data.peaks.assessmentHour.count}{" "}
              assessment starts at peak
            </p>
          </div>

          <div className="rounded-[24px] border border-[#171519]/7 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F1]">
                <Clock3 className="h-4 w-4" />
              </div>

              {kpis.clientsWithoutAssessment >
              0 ? (
                <ArrowDownRight className="h-4 w-4 text-[#8C4141]" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[#2D7040]" />
              )}
            </div>

            <p className="mt-5 font-mono text-[8px] uppercase tracking-wider text-[#171519]/35">
              Attention required
            </p>

            <p className="mt-1 text-xl font-semibold">
              {kpis.clientsWithoutAssessment}
            </p>

            <p className="mt-1 text-[9px] text-[#171519]/40">
              accounts with no assessment activity
            </p>
          </div>
        </section>

        {/* BEHAVIOR */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-[#171519]/7 bg-white p-5 shadow-[0_12px_40px_rgba(23,21,25,0.035)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader
                eyebrow="User behavior"
                title="Account creation"
                description="When users are most likely to join the platform."
              />

              <div className="rounded-xl bg-[#171519] px-3 py-2 text-right text-white">
                <p className="font-mono text-[7px] uppercase tracking-wider text-white/40">
                  Peak
                </p>

                <p className="mt-1 text-sm font-semibold text-[#C8A256]">
                  {formatHour(
                    data.peaks
                      .accountCreationHour.hour
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    data.charts
                      .accountCreationByHour
                  }
                  margin={{
                    top: 5,
                    right: 0,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#171519"
                    strokeOpacity={0.05}
                  />

                  <XAxis
                    dataKey="hour"
                    tickFormatter={formatHour}
                    interval={2}
                    tick={{
                      fontSize: 8,
                      fill: "#171519",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 8,
                      fill: "#171519",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    labelFormatter={(label) =>
                      formatHour(Number(label))
                    }
                    formatter={(value) => [
                      value,
                      "Accounts",
                    ]}
                    contentStyle={{
                      borderRadius: 14,
                      border:
                        "1px solid rgba(23,21,25,0.08)",
                      fontSize: 10,
                    }}
                  />

                  <Bar
                    dataKey="count"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    fill="#171519"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#171519]/7 bg-white p-5 shadow-[0_12px_40px_rgba(23,21,25,0.035)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader
                eyebrow="Assessment behavior"
                title="Assessment activity"
                description="When users are most likely to begin their diagnostic."
              />

              <div className="rounded-xl bg-[#F8F5F1] px-3 py-2 text-right">
                <p className="font-mono text-[7px] uppercase tracking-wider text-[#171519]/35">
                  Peak
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatHour(
                    data.peaks.assessmentHour
                      .hour
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    data.charts
                      .assessmentActivityByHour
                  }
                  margin={{
                    top: 5,
                    right: 0,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#171519"
                    strokeOpacity={0.05}
                  />

                  <XAxis
                    dataKey="hour"
                    tickFormatter={formatHour}
                    interval={2}
                    tick={{
                      fontSize: 8,
                      fill: "#171519",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 8,
                      fill: "#171519",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    labelFormatter={(label) =>
                      formatHour(Number(label))
                    }
                    formatter={(value) => [
                      value,
                      "Assessments",
                    ]}
                    contentStyle={{
                      borderRadius: 14,
                      border:
                        "1px solid rgba(23,21,25,0.08)",
                      fontSize: 10,
                    }}
                  />

                  <Bar
                    dataKey="count"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    fill="#C8A256"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* FINANCIAL */}
        <section className="mt-6 rounded-[30px] bg-[#171519] p-5 text-white shadow-[0_18px_60px_rgba(23,21,25,0.12)] md:p-7">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <SectionHeader
              eyebrow="Financial intelligence"
              title="Revenue structure"
              description="A simple view of platform economics and developer allocation."
            />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8">
              <BarChart3 className="h-4 w-4 text-[#C8A256]" />
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
              <p className="font-mono text-[8px] uppercase tracking-wider text-white/35">
                Gross revenue
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {formatMoney(
                  kpis.totalRevenue
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-[#C8A256]/15 bg-[#C8A256]/8 p-5">
              <p className="font-mono text-[8px] uppercase tracking-wider text-[#C8A256]/60">
                Developer · 10%
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#C8A256]">
                {formatMoney(
                  kpis.developerProfit
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
              <p className="font-mono text-[8px] uppercase tracking-wider text-white/35">
                Barandy net
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {formatMoney(
                  kpis.barandyRevenue
                )}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] uppercase tracking-wider text-white/35">
                Revenue allocation
              </span>

              <span className="font-mono text-[8px] text-white/40">
                90 / 10
              </span>
            </div>

            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full bg-white"
                style={{ width: "90%" }}
              />

              <div
                className="h-full bg-[#C8A256]"
                style={{ width: "10%" }}
              />
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-[9px] text-white/40">
                Barandy · 90%
              </span>

              <span className="text-[9px] text-[#C8A256]">
                Developer · 10%
              </span>
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-6 rounded-[30px] border border-[#171519]/7 bg-white p-5 shadow-[0_12px_40px_rgba(23,21,25,0.035)] md:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Live pulse"
              title="Recent activity"
              description="The latest movements across the Barandy platform."
            />

            <Link
              href="/admin/clients"
              className="group inline-flex items-center gap-2 self-start rounded-xl border border-[#171519]/8 px-3 py-2 text-[8px] font-semibold uppercase tracking-wider text-[#171519]/55 transition hover:bg-[#F8F5F1]"
            >
              Manage clients
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            {/* ACCOUNTS */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F1]">
                  <UserPlus className="h-3.5 w-3.5" />
                </div>

                <p className="text-xs font-semibold">
                  New accounts
                </p>
              </div>

              {data.recent.users.length ===
              0 ? (
                <p className="mt-4 text-[10px] text-[#171519]/35">
                  No accounts yet.
                </p>
              ) : (
                <div className="divide-y divide-[#171519]/5">
                  {data.recent.users.map(
                    (user) => {
                      const name =
                        getUserName(user);

                      return (
                        <ActivityRow
                          key={user.id}
                          initials={getInitials(
                            name
                          )}
                          title={name}
                          subtitle={user.email}
                          time={formatRelativeDate(
                            user.createdAt
                          )}
                        />
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* ASSESSMENTS */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F1]">
                  <Target className="h-3.5 w-3.5" />
                </div>

                <p className="text-xs font-semibold">
                  Assessments
                </p>
              </div>

              {data.recent.assessments
                .length === 0 ? (
                <p className="mt-4 text-[10px] text-[#171519]/35">
                  No assessment activity yet.
                </p>
              ) : (
                <div className="divide-y divide-[#171519]/5">
                  {data.recent.assessments.map(
                    (assessment) => {
                      const name =
                        getUserName(
                          assessment.user
                        );

                      return (
                        <div
                          key={
                            assessment.id
                          }
                          className="py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-[10px] font-semibold">
                              {name}
                            </p>

                            <span
                              className={[
                                "rounded-full px-2 py-1 font-mono text-[7px] uppercase tracking-wider",
                                assessment.status ===
                                "COMPLETED"
                                  ? "bg-[#E8F4EA] text-[#2D7040]"
                                  : assessment.status ===
                                      "IN_PROGRESS"
                                    ? "bg-[#FFF5DD] text-[#80621F]"
                                    : "bg-[#F1EFEC] text-[#171519]/45",
                              ].join(
                                " "
                              )}
                            >
                              {assessment.status.replace(
                                "_",
                                " "
                              )}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#F1EFEC]">
                              <div
                                className="h-full rounded-full bg-[#171519]"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      assessment.progress
                                    )
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="font-mono text-[8px] font-semibold">
                              {
                                assessment.progress
                              }
                              %
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* PAYMENTS */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F1]">
                  <CreditCard className="h-3.5 w-3.5" />
                </div>

                <p className="text-xs font-semibold">
                  Payments
                </p>
              </div>

              {data.recent.payments
                .length === 0 ? (
                <p className="mt-4 text-[10px] text-[#171519]/35">
                  No payments yet.
                </p>
              ) : (
                <div className="divide-y divide-[#171519]/5">
                  {data.recent.payments.map(
                    (payment) => {
                      const name =
                        getUserName(
                          payment.user
                        );

                      return (
                        <ActivityRow
                          key={payment.id}
                          title={name}
                          subtitle={`${payment.status} · ${payment.amount} ${payment.currency.toUpperCase()}`}
                          time={formatRelativeDate(
                            payment.createdAt
                          )}
                          icon={DollarSign}
                          iconClass="text-[#B58D59]"
                        />
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[#171519]/7 py-6 text-[8px] text-[#171519]/35 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <img
              src="/LOGO.png"
              alt="Barandy"
              className="h-5 w-auto opacity-60"
            />

            <span>
              Strategic Personal Brand Architecture
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Developer commission · 10%
            </span>

            <span>·</span>

            <span>
              {new Date().toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

