"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgeGate } from "@/components/landing/client";
import { Portrait } from "@/components/portrait";
import { Button, Field, Wordmark } from "@/components/ui";
import { companions } from "@/lib/companions";
import { setWallet } from "@/lib/wallet";

const luna = companions.find((c) => c.id === "luna")!;

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  // shortcut: mock auth; real sign-in/up (and Google OAuth) replaces this submit.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    if (String(f.get("password")).length < 8) return setError("Use at least 8 characters for your password.");
    setWallet({ email, name: String(f.get("name") || email.split("@")[0]) });
    router.push("/app");
  };

  return (
    <>
      <AgeGate />
      <main className="grain velvet grid min-h-dvh md:grid-cols-2">
        <div className="vignette relative hidden overflow-hidden md:block">
          <Portrait companion={luna} priority sizes="50vw" />
          <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-plum/20 to-transparent" />
          <p className="absolute bottom-10 left-10 z-[2] max-w-[18ch] font-display text-5xl leading-[0.95] italic text-ivory">She&apos;s been waiting.</p>
        </div>

        {/* Phones: she watches from the top of the screen and fades into the form. */}
        <div className="absolute inset-x-0 top-0 h-[46svh] overflow-hidden md:hidden" aria-hidden>
          <Portrait companion={luna} sizes="100vw" className="opacity-55" />
          <div className="absolute inset-0 bg-linear-to-b from-ink-950/40 via-ink-950/60 to-ink-950" />
        </div>
        <div className="relative z-[2] flex flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 sm:px-10">
          <Link href="/" aria-label="Amora home" className="self-start">
            <Wordmark />
          </Link>

          <div className="mx-auto my-auto w-full max-w-sm py-10 max-md:mt-[26svh]">
            <h1 className="font-display text-5xl leading-none">{mode === "up" ? "Make it yours." : "Welcome back."}</h1>
            <p className="mt-3 text-muted">{mode === "up" ? "Free to start. Anonymous. No card." : "She remembers where you left off."}</p>

            <form onSubmit={submit} className="mt-8 grid gap-5" noValidate={false}>
              {mode === "up" && <Field label="What should she call you?" name="name" autoComplete="nickname" placeholder="A name or nickname" />}
              <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
              <div className="relative">
                <Field
                  label="Password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                  onChange={() => setError("")}
                  hint={mode === "up" ? "At least 8 characters." : undefined}
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute top-[2.375rem] right-4 text-sm text-muted hover:text-ivory">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {mode === "up" && (
                <label className="flex gap-3 text-sm text-muted">
                  <input type="checkbox" required className="mt-0.5 size-5 shrink-0 accent-[var(--color-champagne)]" />
                  <span>
                    I&apos;m 18 or older and accept the{" "}
                    <Link href="#" className="text-ivory underline underline-offset-4">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-ivory underline underline-offset-4">
                      Privacy policy
                    </Link>
                    .
                  </span>
                </label>
              )}
              {error && (
                <p role="alert" className="text-sm text-rose">
                  {error}
                </p>
              )}
              <Button size="lg" type="submit">
                {mode === "up" ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4 text-xs text-faint">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
            <Button variant="secondary" size="lg" className="w-full" type="button" onClick={() => router.push("/app")}>
              Continue with Google
            </Button>

            <p className="mt-8 text-center text-sm text-muted">
              {mode === "up" ? "Already have an account?" : "New here?"}{" "}
              <button type="button" onClick={() => (setMode(mode === "up" ? "in" : "up"), setError(""))} className="text-champagne underline underline-offset-4">
                {mode === "up" ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
