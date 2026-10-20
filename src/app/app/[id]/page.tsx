import { ArrowRight, CaretLeft, ChatCircleDots } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition, type CSSProperties } from "react";
import { Crossfade } from "@/components/board/crossfade";
import { fitName } from "@/components/board/fit-name";
import { Gallery, TrackView } from "@/components/board/profile-client";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { Avatar, Bubble, ButtonLink, CompanionCard, Facts } from "@/components/ui";
import { scripts } from "@/lib/chat-scripts";
import { bios, companions } from "@/lib/companions";

const count = (n: number) => n.toLocaleString("en-US");
/** Taglines are stored without a full stop; add one unless she ended on her own punctuation. */
const sentence = (t: string) => (/[.!?…]$/.test(t) ? t : `${t}.`);
const i = (n: number) => ({ ["--i" as string]: n }) as CSSProperties;

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
    <Suspense fallback={<div className="aspect-[4/5] max-h-[64svh] w-full bg-ink-2 lg:mx-8 lg:mt-6 lg:h-[calc(100dvh-8rem)] lg:w-[42%]" />}>
      <ProfileBody params={params} />
    </Suspense>
  );
}

async function ProfileBody({ params }: Pick<PageProps<"/app/[id]">, "params">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  if (!c) notFound();

  const script = scripts[c.id];
  // What she actually sends when you first open the chat: the truest sample of how she talks.
  const hello = (script?.live ?? []).filter((b): b is string => typeof b === "string").slice(0, 2);
  // Same vibe first, topped up with whoever is online so the row is always full.
  const others = companions.filter((x) => x.id !== c.id);
  const like = [...others.filter((x) => x.vibe === c.vibe), ...others.filter((x) => x.vibe !== c.vibe && x.online)].slice(0, 4);

  const facts = [
    ["Age", c.age],
    ["City", c.city],
    ["Sign", c.sign],
    ["Languages", c.langs.join(", ")],
    ["Vibe", c.vibe],
    ["Photos", count(c.photos)],
  ] as const;
  const about = [
    ["Her nature", c.traits],
    ["Talk to her about", c.interests],
  ] as const;

  return (
    <main className="mx-auto max-w-[1440px] lg:px-8 lg:pt-6 lg:pb-24">
      <TrackView id={c.id} />
      {/* Its own grid, so the sticky photo stops where her details end instead of riding over the row below. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12 xl:gap-16">

        {/* The front of her card: one photograph, slowly trading places with her second. Sticky beside the details on desktop. */}
        <div className="relative lg:sticky lg:top-[6.5rem] lg:self-start">
          <div className="relative aspect-[4/5] max-h-[64svh] w-full overflow-hidden bg-ink-2 lg:aspect-auto lg:h-[calc(100dvh-8rem)] lg:max-h-[60rem]">
            <ViewTransition name={`portrait-${c.id}`} share="morph" default="none">
              <div className="absolute inset-0">
                <Crossfade
                  a={<Portrait companion={c} priority sizes="(max-width: 1024px) 100vw, 42vw" />}
                  b={c.gallery[0] && <Portrait companion={c} src={c.gallery[0]} sizes="(max-width: 1024px) 100vw, 42vw" />}
                />
              </div>
            </ViewTransition>
            <div className="scrim-t absolute inset-x-0 top-0 h-24 lg:hidden" />
          </div>
          <Link
            href="/app"
            aria-label="Back to the board"
            className="press absolute top-[max(1rem,env(safe-area-inset-top))] left-4 grid size-11 place-items-center bg-ink/60 text-paper hover:bg-ink/80 lg:top-4"
          >
            <CaretLeft weight="bold" className="size-[1.125rem]" aria-hidden />
          </Link>
        </div>

        {/* The back of her card. */}
        <div className="min-w-0 px-4 pt-5 pb-8 md:px-8 lg:px-0 lg:pt-1 lg:pb-0">
          <header className="@container">
            <h1 className="rise font-display [--cap:2.75rem] [text-wrap:balance] lg:[--cap:4.5rem]" style={{ ...fitName(c.name, "var(--cap)", "0rem", 2), ...i(0) }}>
              {c.name}
            </h1>
            <Facts
              className="rise mt-2 text-body text-paper/75 tabular lg:mt-3 lg:text-lead"
              items={[
                c.age,
                c.city,
                c.sign,
                c.online ? (
                  <span className="inline-flex items-center gap-2 text-paper">
                    <span className="live-dot size-2 rounded-full bg-live" aria-hidden />
                    Online now
                  </span>
                ) : (
                  script?.lastSeen && <span className="text-paper/60">Seen {script.lastSeen}</span>
                ),
              ]}
            />
          </header>

          {/* Phones: pinned under the thumb. Desktop: inline under her name. */}
          <div
            className="rise fixed inset-x-0 bottom-0 z-40 flex gap-2 bg-ink px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-8 lg:static lg:mt-6 lg:bg-transparent lg:p-0"
            style={i(1)}
          >
            <ButtonLink href={`/app/${c.id}/chat`} className="min-w-0 flex-1 lg:flex-initial lg:px-8">
              <ChatCircleDots weight="fill" className="size-5 shrink-0" aria-hidden />
              <span className="truncate">Message {c.name}</span>
            </ButtonLink>
            {/* Matches the Message button height, whatever size the shared button settles on. */}
            <SaveButton id={c.id} name={c.name} label className="h-auto! shrink-0" />
          </div>

          <section aria-label={`About ${c.name}`} className="rise mt-6 lg:mt-10" style={i(2)}>
            <p className="max-w-[30ch] text-lead font-medium [overflow-wrap:anywhere]">{sentence(c.tagline)}</p>
            {bios[c.id] && <p className="mt-3 max-w-[58ch] text-body text-paper/80">{bios[c.id]}</p>}
          </section>

          {hello.length > 0 && (
            <Link
              href={`/app/${c.id}/chat`}
              className="reveal press group mt-8 block bg-ink-2 p-4 hover:bg-ink-3 active:scale-[0.99] md:p-5 lg:mt-10"
              aria-label={`Open the chat with ${c.name}`}
            >
              <span className="flex items-center gap-3">
                <Avatar companion={c} size="sm" showOnline={false} />
                <span className="min-w-0">
                  <span className="block text-body font-medium">How she says hello</span>
                  <span className="block text-small text-muted">The first thing she sends you</span>
                </span>
              </span>
              <div className="mt-4 flex flex-col gap-1.5">
                {hello.map((line) => (
                  <Bubble key={line} from="her">
                    {line}
                  </Bubble>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-2 text-body font-medium text-rouge">
                Answer her
                <ArrowRight weight="bold" className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          )}

          <dl className="reveal mt-3 grid grid-cols-3 gap-x-4 gap-y-5 bg-ink-2 p-4 md:p-5">
            {facts.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-small text-muted">{label}</dt>
                <dd className="mt-0.5 text-body font-medium tabular [overflow-wrap:anywhere]">{value}</dd>
              </div>
            ))}
          </dl>

          <dl className="reveal mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10">
            {about
              .filter(([, words]) => words.length)
              .map(([label, words]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-small text-muted">{label}</dt>
                  <dd className="mt-1.5">
                    <Facts className="text-body text-paper [overflow-wrap:anywhere]" items={words} />
                  </dd>
                </div>
              ))}
          </dl>

          <section aria-labelledby="photos" className="reveal mt-12 lg:mt-14">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="photos" className="font-display text-lead">
                Her photos
              </h2>
              {c.photos > 0 && <p className="shrink-0 text-small text-muted tabular">{count(c.photos)} in all</p>}
            </div>
            <div className="mt-4">
              <Gallery c={c} />
            </div>
          </section>
        </div>

      </div>

      {like.length > 0 && (
        <section aria-labelledby="like" className="reveal px-4 pt-6 pb-10 md:px-8 lg:px-0 lg:pt-20 lg:pb-0">
          <h2 id="like" className="font-display text-lead">
            More like her
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {like.map((x) => (
              <CompanionCard key={x.id} companion={x} href={`/app/${x.id}`} size="tile" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
