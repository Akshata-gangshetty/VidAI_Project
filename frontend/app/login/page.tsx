"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is missing. Check .env.local.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned an invalid response (HTTP ${response.status}). Check the backend terminal.`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Login failed. Please try again."
        );
      }

      // Backend sets authentication cookies.
      // Navigate after successful login.
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b12] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11141e] p-8 shadow-2xl shadow-violet-950/20 sm:p-10">
        <a href="/" className="text-2xl font-extrabold">
          Vid<span className="text-violet-400">AI</span>
        </a>

        <h1 className="mt-8 text-3xl font-bold">
          Welcome back
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Log in to continue your AI-powered learning journey.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-violet-400"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in to VidAI →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-violet-300 hover:text-violet-200"
          >
            Sign up
          </a>
        </p>

        <a
          href="/"
          className="mt-6 block text-center text-sm text-gray-500 hover:text-white"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}