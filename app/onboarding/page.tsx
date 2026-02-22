"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  birthday: string; // YYYY-MM-DD
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    birthday: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Backend route will be added in the next step.
    // For now, we just simulate a successful submit.
    try {
      // TODO: replace with:
      // const res = await fetch("/api/onboarding", { method: "POST", ... })
      await new Promise((r) => setTimeout(r, 300));
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const requiredMissing =
    !form.birthday ||
    !form.line1 ||
    !form.city ||
    !form.state ||
    !form.postalCode ||
    !form.country;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Finish setup</h1>
          <p className="mt-2 text-sm text-gray-600">
            We need your birthday and shipping address so your groups can send gifts automatically.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            {/* Profile */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900">Profile</h2>

              <div className="mt-3 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Name (optional)</label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    placeholder="Joo Young Han"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">
                    Birthday <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.birthday}
                    onChange={(e) => update("birthday", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Used to automatically create your group’s planning room 30 days before your birthday.
                  </p>
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900">Shipping address</h2>

              <div className="mt-3 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-700">
                    Address line 1 <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={form.line1}
                    onChange={(e) => update("line1", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    placeholder="123 Main St"
                    autoComplete="address-line1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Address line 2</label>
                  <input
                    value={form.line2}
                    onChange={(e) => update("line2", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    placeholder="Apt / Unit"
                    autoComplete="address-line2"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-gray-700">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                      placeholder="Maple Valley"
                      autoComplete="address-level2"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">
                      State <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.state}
                      onChange={(e) => update("state", e.target.value.toUpperCase())}
                      className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                      placeholder="WA"
                      autoComplete="address-level1"
                      required
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-gray-700">
                      ZIP / Postal code <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.postalCode}
                      onChange={(e) => update("postalCode", e.target.value)}
                      className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                      placeholder="98038"
                      autoComplete="postal-code"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="KR">Korea</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading || requiredMissing}
              className="w-full rounded-xl bg-black px-4 py-2.5 text-white disabled:opacity-40"
            >
              {loading ? "Saving..." : "Save and continue"}
            </button>

            <p className="text-xs text-gray-500">
              You can update this later from your profile settings.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}