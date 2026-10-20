import { CaretLeft, ChatCircleDots } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { Crossfade } from "@/components/board/crossfade";
import { fitName } from "@/components/board/fit-name";
import { Gallery, TrackView } from "@/components/board/profile-client";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { ButtonLink } from "@/components/ui";
import { bios, companions } from "@/lib/companions";

export function generateStaticParams() {
  return companions.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/[id]">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  return { title: c ? `${c.name} · Amora` : "Amora" };
}

// Suspense gives navigation an instant shell while params resolve.
export default function Profile({ params }: PageProps<"/app/[id]">) {
  return (
    <Suspense fallback={<div className="h-[86svh] bg-ink-2 md:h-[calc(100dvh-5rem)] md:w-1/2" />}>
      <ProfileBody params={params} />
    </Suspense>
  );
}

async function ProfileBody({ params }: Pick<PageProps<"/app/[id]">, "params">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  if (!c) notFound();

  const facts = [
    ["Age", c.age],
    ["City", c.city],
    ["Sign", c.sign],
    ["Languages", c.langs.join(", ")],
    ["Vibe", c.vibe],
    ["Photos", c.photos],
  ] as const;

  return (
    <main className="md:grid md:grid-cols-2">
      <TrackView id={c.id} />

      {/* The front of her card: full-bleed, slowly crossfading, sticky beside the facts on desktop. */}
      <div className="@container relative md:sticky md:top-20 md:h-[calc(100dvh-5rem)]">
        <div className="relative h-[86svh] overflow-hidden bg-ink-2 md:h-full">
          <ViewTransition name={`portrait-${c.id}`} share="morph" default="none">
            <div className="drift absolute inset-0 origin-top md:animate-none!">
              <Crossfade
                a={<Portrait companion={c} priority sizes="(max-width: 768px) 100vw, 50vw" />}
                b={c.gallery[0] && <Portrait companion={c} src={c.gallery[0]} sizes="(max-width: 768px) 100vw, 50vw" />}
              />
            </div>
          </ViewTransition>
          <div className="scrim-t absolute inset-x-0 top-0 h-28 md:hidden" />
          <div className="scrim-b absolute inset-x-0 bottom-0 h-[55%]" />
        </div>
        <Link
          href="/app"
          aria-label="Back to the board"
          className="press absolute top-[max(1rem,env(safe-area-inset-top))] left-4 grid size-11 place-items-center bg-ink/60 text-paper hover:bg-ink/80 md:top-6 md:left-6"
        >
          <CaretLeft weight="bold" className="size-[1.125rem]" aria-hidden />
        </Link>
        <div className="drift-out absolute inset-x-0 bottom-0 p-4 pb-6 md:p-8 md:pb-10 md:animate-none!">
          <h1 className="font-display leading-[0.88] text-paper [--inset:2rem] md:[--inset:4rem]" style={fitName(c.name, "10rem", "var(--inset)")}>
            {c.name}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 text-lead text-paper/85 tabular">
            {c.age} · {c.city} · {c.sign}
            {c.online && (
              <span className="ml-1 inline-flex items-center gap-2 text-body text-paper">
                <span className="live-dot size-2 rounded-full bg-live" aria-hidden />
                Online
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        {/* Phones: pinned to the thumb. Desktop: pinned under the top bar. */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 bg-ink px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:sticky md:top-20 md:bottom-auto md:z-10 md:px-12 md:py-5">
          <ButtonLink href={`/app/${c.id}/chat`} className="flex-1 md:flex-none md:px-10">
            <ChatCircleDots weight="fill" className="size-5" aria-hidden />
            Message {c.name}
          </ButtonLink>
          <SaveButton id={c.id} name={c.name} label />
        </div>

        {/* The back of her card: a paper field, ink type. */}
        <section aria-label={`About ${c.name}`} className="bg-paper px-4 py-10 text-ink md:px-12 md:py-14">
          <p className="reveal max-w-[28ch] text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.15] font-medium">{c.tagline}.</p>
          {bios[c.id] && <p className="reveal mt-5 max-w-[56ch] text-body text-ink/80 md:text-lead">{bios[c.id]}</p>}

          <dl className="reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {facts.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-small text-ink/60">{label}</dt>
                <dd className="mt-1 text-lead font-medium tabular [overflow-wrap:anywhere]">{value}</dd>
              </div>
            ))}
          </dl>

          <dl className="reveal mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <dt className="text-small text-ink/60">Her nature</dt>
              <dd className="mt-1 text-lead font-medium">{c.traits.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-small text-ink/60">Talk to her about</dt>
              <dd className="mt-1 text-lead font-medium">{c.interests.join(", ")}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="photos" className="pt-10 pb-6 md:px-12 md:py-14">
          <div className="flex items-baseline justify-between gap-4 px-4 md:px-0">
            <h2 id="photos" className="font-display text-head">
              Her photos
            </h2>
            <p className="shrink-0 text-body text-muted tabular">{c.photos} in all</p>
          </div>
          <div className="mt-5">
            <Gallery c={c} />
          </div>
        </section>
      </div>
    </main>
  );
}
