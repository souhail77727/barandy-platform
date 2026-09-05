import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

  if (
    !user ||
    (user.role !== "ADMIN" && user.role !== "DEVELOPER")
  ) {
    redirect("/");
  }

  const adminName =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || user.email;

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      {/* ADMIN NAVIGATION */}
      <header className="border-b border-black/10 bg-[#F8F5F1]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex min-h-20 items-center justify-between gap-8">
            {/* BRAND */}
            <Link href="/admin" className="shrink-0">
              <p className="text-sm font-semibold tracking-[0.25em]">
                BARANDY
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-black/40">
                Admin Platform
              </p>
            </Link>

            {/* NAVIGATION */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/admin"
                className="px-4 py-2 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
              >
                Dashboard
              </Link>

              <Link
                href="/admin/pending"
                className="px-4 py-2 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
              >
                Pending Payments
              </Link>

              <Link
                href="/admin/clients"
                className="px-4 py-2 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
              >
                Clients
              </Link>

              <Link
                href="/admin/analytics"
                className="px-4 py-2 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
              >
                Analytics
              </Link>
            </nav>

            {/* ADMIN ACCOUNT */}
            <div className="flex items-center gap-5">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">
                  {adminName}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-black/40">
                  {user.role}
                </p>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="border border-black/10 px-4 py-2 text-xs font-medium transition hover:border-black/30 hover:bg-white"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <nav className="flex gap-1 overflow-x-auto border-t border-black/10 py-3 md:hidden">
            <Link
              href="/admin"
              className="whitespace-nowrap px-3 py-2 text-xs text-black/60 hover:bg-black/5"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/pending"
              className="whitespace-nowrap px-3 py-2 text-xs text-black/60 hover:bg-black/5"
            >
              Pending
            </Link>

            <Link
              href="/admin/clients"
              className="whitespace-nowrap px-3 py-2 text-xs text-black/60 hover:bg-black/5"
            >
              Clients
            </Link>

            <Link
              href="/admin/analytics"
              className="whitespace-nowrap px-3 py-2 text-xs text-black/60 hover:bg-black/5"
            >
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      {/* ADMIN CONTEXT BAR */}
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-black" />

            <span className="text-xs font-medium uppercase tracking-[0.15em] text-black/50">
              Admin workspace
            </span>
          </div>

          <Link
            href="/"
            className="text-xs text-black/40 transition hover:text-black"
          >
            ← View public site
          </Link>
        </div>
      </div>

      {/* PAGE CONTENT */}
      {children}
    </div>
  );
}
