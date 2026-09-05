
import Link from "next/link";

import SignOutButton from "@/components/auth/SignOutButton";

type ClientHeaderProps = {
  firstName?: string | null;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  currentPage?: "dashboard" | "assessment" | "payment" | "results";
};

export default function ClientHeader({
  firstName,
  showBack = false,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  currentPage,
}: ClientHeaderProps) {
  const displayName = firstName?.trim() || "Account";

  return (
    <header className="border-b border-black/10">
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
        <div className="flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="group shrink-0">
            <p className="text-sm font-semibold tracking-[0.25em]">
              BARANDY
            </p>

            <p className="mt-2 text-xs text-black/40 transition group-hover:text-black/70">
              Personal Brand Intelligence
            </p>
          </Link>

          {/* Account */}
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-black/45 sm:block">
              {displayName}
            </span>

            <SignOutButton />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <NavLink
            href="/dashboard"
            active={currentPage === "dashboard"}
          >
            Dashboard
          </NavLink>

          <NavLink
            href="/assessment"
            active={currentPage === "assessment"}
          >
            Assessment
          </NavLink>

          <NavLink
            href="/payment"
            active={currentPage === "payment"}
          >
            Payment
          </NavLink>

          <NavLink
            href="/results"
            active={currentPage === "results"}
          >
            Brand DNA
          </NavLink>
        </nav>

        {/* Back navigation */}
        {showBack && (
          <div className="mt-6">
            <Link
              href={backHref}
              className="inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-black/45 transition hover:text-black"
            >
              <span className="mr-2 text-sm">←</span>
              {backLabel}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-xs font-medium uppercase tracking-[0.15em] transition ${
        active
          ? "text-[#171519]"
          : "text-black/40 hover:text-black"
      }`}
    >
      {children}
    </Link>
  );
}

