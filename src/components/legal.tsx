import Link from "next/link";
import { Wordmark } from "@/components/ui";

// shortcut: placeholder legal copy so footer links resolve; replace with counsel-approved text before launch.
export function Legal({ title, sections }: { title: string; sections: [string, string][] }) {
  return (
    <main className="min-h-dvh bg-ink px-4 pb-24 md:px-8">
      <header className="flex h-16 items-center md:h-20">
        <Link href="/" className="press" aria-label="Amora home">
          <Wordmark />
        </Link>
      </header>
      <div className="mx-auto max-w-3xl pt-12 md:pt-20">
        <h1 className="rise font-display text-head">{title}</h1>
        <p className="rise mt-4 text-small text-muted [--i:1]">Draft. Last updated 20 October 2026.</p>
        <div className="mt-14 grid gap-2">
          {sections.map(([h, body], i) => (
            <section key={h} className="rise bg-ink-2 p-6 md:p-8" style={{ ["--i" as string]: i + 2 }}>
              <h2 className="text-lead font-medium">{h}</h2>
              <p className="mt-3 max-w-[65ch] text-body text-paper/85">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
