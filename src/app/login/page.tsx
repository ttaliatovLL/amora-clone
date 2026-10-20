"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppleLogo, GoogleLogo } from "@phosphor-icons/react/ssr";
import { AgeGate } from "@/components/landing/client";
import { Portrait } from "@/components/portrait";
import { Button, Field, Segmented, Wordmark } from "@/components/ui";
import { companions } from "@/lib/companions";
import { setWallet } from "@/lib/wallet";

const luna = companions.find((c) => c.id === "luna")!;

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  // shortcut: mock auth, nothing leaves the browser; real sign-in/up (and OAuth) replaces this submit.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // One house-styled message instead of the browser's validation bubbles; focus goes to the field to fix.
    const bad = form.querySelector<HTMLInputElement>(":invalid");
    if (bad) {
      bad.focus();
      return setError(
        bad.name === "email"
          ? "Enter your email address, like you@example.com."
          : bad.name === "password"
            ? "Use at least 8 characters for your password."
            : "Confirm you're 18 or older to continue.",
      );
    }
    const f = new FormData(form);
    const email = String(f.get("email")).trim();
    setWallet({ email, name: String(f.get("name") || email.split("@")[0]) });
    router.push("/app");
  };
  const switchTo = (m: "in" | "up") => (setMode(m), setError(""));

  return (
    <>
      <AgeGate />
      <main className="min-h-dvh bg-ink md:grid md:grid-cols-[1.05fr_1fr]">
        {/* Her comp card: the whole left half on desktop, the top of the screen on phones. */}
        <div className="relative h-[44svh] min-h-72 overflow-hidden bg-ink-2 md:sticky md:top-0 md:h-dvh">
          <Portrait companion={luna} priority sizes="(max-width: 768px) 100vw, 52vw" />
          <div className="scrim-b absolute inset-x-0 bottom-0 h-2/3" />
          <Link href="/" aria-label="Amora home" className="press absolute top-[calc(env(safe-area-inset-top)+1.5rem)] left-4 md:top-8 md:left-8">
            <Wordmark />
          </Link>
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
            <p className="font-display text-mega">{luna.name}</p>
            <p className="mt-2 truncate text-body text-paper/80 tabular md:mt-3">
              {luna.age} · {luna.city} · {luna.tagline}
            </p>
          </div>
        </div>

        <div className="flex px-4 pt-6 pb-12 sm:px-8 md:items-center md:py-16">
          <div className="rise mx-auto w-full max-w-md">
            <Segmented
              label="Account"
              value={mode}
              onChange={switchTo}
              options={[
                { value: "up", label: "Create account" },
                { value: "in", label: "Sign in" },
              ]}
            />

            <h1 className="mt-8 font-display text-head md:mt-10">{mode === "up" ? "Make it yours" : "Welcome back"}</h1>
            <p className="mt-3 text-body text-muted">{mode === "up" ? "Free to start. Anonymous. No card." : "She remembers where you left off."}</p>

            <form onSubmit={submit} noValidate onChange={() => error && setError("")} className="mt-6 grid gap-4 md:mt-8">
              {mode === "up" && <Field label="What should she call you?" name="name" autoComplete="nickname" placeholder="A name or nickname" />}
              <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
              <Field
                label="Password"
                name="password"
                type={show ? "text" : "password"}
                required
                minLength={8}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                hint={mode === "up" ? "At least 8 characters." : undefined}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-pressed={show}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="press inline-flex h-10 shrink-0 items-center px-3 text-small text-muted hover:bg-ink-5 hover:text-paper"
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                }
              />
              {mode === "up" && (
                <label className="flex cursor-pointer gap-3 text-small text-muted">
                  <input type="checkbox" name="adult" required className="mt-px size-[1.125rem] shrink-0 accent-[var(--color-rouge)]" />
                  <span>
                    I&apos;m 18 or older and accept the{" "}
                    <Link href="#" className="text-paper underline underline-offset-4">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-paper underline underline-offset-4">
                      Privacy policy
                    </Link>
                    .
                  </span>
                </label>
              )}
              {error && (
                <p role="alert" className="bg-oxblood px-4 py-3 text-small text-paper">
                  {error}
                </p>
              )}
              <Button size="lg" type="submit" className="mt-1">
                {mode === "up" ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-small text-muted">Or continue with</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="lg" type="button" onClick={() => router.push("/app")}>
                <GoogleLogo weight="bold" className="size-5" aria-hidden />
                Google
              </Button>
              <Button variant="secondary" size="lg" type="button" onClick={() => router.push("/app")}>
                <AppleLogo weight="fill" className="size-5" aria-hidden />
                Apple
              </Button>
            </div>
            <p className="mt-6 text-small text-faint">Demo: nothing you type here is sent anywhere.</p>
          </div>
        </div>
      </main>
    </>
  );
}
