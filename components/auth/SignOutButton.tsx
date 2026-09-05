"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-black/50 transition hover:border-black/20 hover:bg-[#171519] hover:text-white"
    >
      Sign Out
    </button>
  );
}