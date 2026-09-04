"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but sign in failed.");
        return;
      }

      router.push("/assessment");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5F1] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-primary font-bold text-3xl text-[#171519]">
            BARANDY
          </h1>

          <p className="text-[#171519]/60 mt-2">
            Create your account to start the assessment
          </p>
        </div>

        <div className="bg-white shadow-sm border border-[#171519]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-[#171519] text-sm font-medium mb-2"
                >
                  First name
                </label>

                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-[#171519]/10 bg-white text-[#171519] outline-none focus:border-[#171519]"
                  autoComplete="given-name"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-[#171519] text-sm font-medium mb-2"
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-[#171519]/10 bg-white text-[#171519] outline-none focus:border-[#171519]"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[#171519] text-sm font-medium mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                className="w-full px-3 py-2.5 border border-[#171519]/10 bg-white text-[#171519] outline-none focus:border-[#171519]"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[#171519] text-sm font-medium mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={8}
                className="w-full px-3 py-2.5 border border-[#171519]/10 bg-white text-[#171519] outline-none focus:border-[#171519]"
                autoComplete="new-password"
              />

              <p className="text-xs text-[#171519]/50 mt-2">
                Must be at least 8 characters.
              </p>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#171519] text-[#F8F5F1] py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-[#171519]/60">
              Already have an account?{" "}
              <a
                href="/sign-in"
                className="text-[#171519] font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}