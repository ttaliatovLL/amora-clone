import Link from "next/link";
import { Wordmark } from "@/components/ui";

// shortcut: placeholder legal copy so footer links resolve; replace with counsel-approved text before launch.
export function Legal({ title, sections }: { title: string; sections: [string, string][] }) {
  return (
    <div className="min-h-dvh bg-ink">
      {/* Same bar height and gutters as the app, so the wordmark never jumps between screens. */}
      <header className="mx-auto flex h-16 max-w-[1440px] items-center px-4 md:h-20 md:px-8">
        <Link href="/" className="press" aria-label="Amora home">
          <Wordmark className="md:text-[1.125rem]" />
        </Link>
      </header>
      <main className="page">
        <div className="max-w-3xl">
          <h1 className="rise font-display text-title">{title}</h1>
          <p className="rise mt-4 text-small text-muted [--i:1]">Draft. Last updated 20 October 2026.</p>
          <div className="mt-8 grid gap-2 md:mt-12">
            {sections.map(([h, body], i) => (
              <section key={h} className="rise bg-ink-2 p-5 md:p-6" style={{ ["--i" as string]: i + 2 }}>
                <h2 className="text-lead font-medium">{h}</h2>
                <p className="mt-2 max-w-[65ch] text-body text-paper/85">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
