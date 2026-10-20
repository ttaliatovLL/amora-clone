"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppleLogo, GoogleLogo } from "@phosphor-icons/react/ssr";
import { AgeGate } from "@/components/landing/client";
import { Portrait } from "@/components/portrait";
import { Button, cx, Field, Wordmark } from "@/components/ui";
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
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    if (String(f.get("password")).length < 8) return setError("Use at least 8 characters for your password.");
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
          <Link href="/" aria-label="Amora home" className="press absolute top-[max(1.25rem,env(safe-area-inset-top))] left-5 md:top-8 md:left-10">
            <Wordmark />
          </Link>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-10">
            <p className="font-display text-mega">{luna.name}</p>
            <p className="mt-3 truncate text-body text-paper/80 tabular">
              {luna.age} · {luna.city} · {luna.tagline}
            </p>
          </div>
        </div>

        <div className="flex px-5 pt-8 pb-12 sm:px-10 md:items-center md:py-16">
          <div className="rise mx-auto w-full max-w-md">
            <div aria-label="Account" className="grid grid-cols-2 bg-ink-2 p-1">
              {([
                ["up", "Create account"],
                ["in", "Sign in"],
              ] as const).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => switchTo(m)}
                  className={cx("press h-11 text-small font-medium", mode === m ? "bg-paper text-ink" : "text-muted hover:text-paper")}
                >
                  {label}
                </button>
              ))}
            </div>

            <h1 className="mt-10 font-display text-head">{mode === "up" ? "Make it yours" : "Welcome back"}</h1>
            <p className="mt-4 text-body text-muted">{mode === "up" ? "Free to start. Anonymous. No card." : "She remembers where you left off."}</p>

            <form onSubmit={submit} className="mt-8 grid gap-5">
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
                  className="[&_input]:pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-pressed={show}
                  className="absolute top-[1.875rem] right-1 flex h-13 items-center px-3 text-small text-muted hover:text-paper"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {mode === "up" && (
                <label className="flex gap-3 text-small text-muted">
                  <input type="checkbox" required className="mt-0.5 size-5 shrink-0 accent-[var(--color-rouge)]" />
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
                <p role="alert" className="text-small text-rouge">
                  {error}
                </p>
              )}
              <Button size="lg" type="submit" className="mt-1">
                {mode === "up" ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="mt-8 text-small text-muted">Or continue with</p>
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
            <p className="mt-8 text-small text-faint">Demo: nothing you type here is sent anywhere.</p>
          </div>
        </div>
      </main>
    </>
  );
}
