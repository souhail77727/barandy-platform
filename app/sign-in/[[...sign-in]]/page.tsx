"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      const session = await getSession();

      const role = session?.user?.role;

      if (role === "ADMIN" || role === "DEVELOPER") {
        router.replace("/admin");
        return;
      }

      if (role === "CLIENT") {
        router.replace("/dashboard");
        return;
      }

      setError(
        "Your account role could not be determined."
      );

      setLoading(false);
    } catch (error) {
      console.error("Sign in error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-block text-sm font-semibold tracking-[0.25em] transition-opacity hover:opacity-70"
          >
            BARANDY
          </Link>

          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-black/40">
            Personal Brand Intelligence
          </p>
        </div>

        <div className="border border-black/10 bg-white p-7 shadow-sm md:p-9">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              Welcome back
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Sign in
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/55">
              Access your Barandy dashboard and continue your
              personal brand journey.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full border border-black/15 bg-[#F8F5F1] px-4 py-3 text-sm outline-none transition focus:border-black/40"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full border border-black/15 bg-[#F8F5F1] px-4 py-3 text-sm outline-none transition focus:border-black/40"
              />
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#171519] px-6 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 border-t border-black/10 pt-6 text-center">
            <p className="text-sm text-black/45">
              Don't have an account?
            </p>

            <Link
              href="/sign-up"
              className="mt-2 inline-block text-sm font-medium underline underline-offset-4 transition hover:opacity-60"
            >
              Create your account
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.15em] text-black/40 transition hover:text-black"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}