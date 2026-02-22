"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Use your Google account to continue.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-6 w-full rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}