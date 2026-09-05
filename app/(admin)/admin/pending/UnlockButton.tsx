"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UnlockButtonProps = {
  userId: string;
  clientName: string;
};

export default function UnlockButton({
  userId,
  clientName,
}: UnlockButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUnlock() {
    const confirmed = window.confirm(
      `Confirm that the payment from ${clientName} has been verified.\n\nThis will immediately unlock their Brand DNA.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/users/${userId}/unlock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to unlock Brand DNA."
        );
      }

      router.refresh();
    } catch (err) {
      console.error("Unlock error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUnlock}
        disabled={loading}
        className="w-full bg-[#171519] px-6 py-4 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 lg:min-w-[240px]"
      >
        {loading
          ? "Unlocking..."
          : "Verify Payment & Unlock"}
      </button>

      {error && (
        <p className="mt-3 text-xs leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}