import { CaretLeft, ChatCircleDots, LockSimple, MapPin, Sparkle } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Portrait } from "@/components/portrait";
import { ButtonLink, Chip } from "@/components/ui";
import { bios, companions } from "@/lib/companions";

export function generateStaticParams() {
  return companions.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/[id]">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  return { title: c ? `${c.name} · Amora` : "Amora" };
}

// shortcut: one portrait, re-cropped per tile, until her real gallery exists. First two open, rest locked.
const CROPS = ["", "scale-[1.7] origin-[50%_22%]", "scale-[1.35] origin-[30%_70%]", "scale-[1.5] origin-[70%_40%]", "scale-[1.25] origin-[50%_90%]", "scale-[1.9] origin-[45%_30%]"];
const OPEN = 2;

// Suspense gives navigation an instant shell while params resolve.
export default function Profile({ params }: PageProps<"/app/[id]">) {
  return (
    <Suspense fallback={<div className="h-[72svh] bg-ink-900 md:h-dvh md:w-1/2" />}>
      <ProfileBody params={params} />
    </Suspense>
  );
}

async function ProfileBody({ params }: Pick<PageProps<"/app/[id]">, "params">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  if (!c) notFound();

  return (
    <main className="pb-32 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:pb-0">
      {/* Portrait: full-bleed on phones, sticky column on desktop. */}
      <div className="relative md:sticky md:top-0 md:h-dvh">
        <div className="vignette relative h-[72svh] overflow-hidden md:h-full">
          <Portrait companion={c} priority sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-linear-to-b from-plum/30 via-transparent to-ink-950" />
        </div>
        <Link
          href="/app"
          aria-label="Back to discover"
          className="glass absolute top-[max(1rem,env(safe-area-inset-top))] left-4 grid size-11 place-items-center rounded-full text-ivory transition-transform active:scale-95"
        >
          <CaretLeft weight="light" className="size-5" aria-hidden />
        </Link>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7 sm:px-8 md:pb-10">
          {c.online && (
            <p className="glass mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-ivory">
              <span className="size-1.5 rounded-full bg-sage" aria-hidden />
              Online now
            </p>
          )}
          <h1 className="font-display text-[clamp(3.75rem,15vw,7rem)] leading-[0.9] [overflow-wrap:anywhere]">
            {c.name} <em className="text-[0.45em] text-champagne">{c.age}</em>
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-muted">
            <MapPin weight="light" className="size-4" aria-hidden />
            {c.city}
          </p>
        </div>
      </div>

      <div className="px-5 pt-8 sm:px-8 md:py-20 md:pr-12">
        <p className="font-display text-[1.75rem] leading-snug italic text-champagne md:text-4xl">“{c.tagline}”</p>
        {bios[c.id] && <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ivory/90">{bios[c.id]}</p>}

        <h2 className="mt-12 flex items-center gap-2 text-sm font-medium text-muted">
          <Sparkle weight="duotone" className="size-4 text-gold" aria-hidden />
          Personality
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {c.traits.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {c.interests.length > 0 && (
          <>
            <h2 className="mt-9 flex items-center gap-2 text-sm font-medium text-muted">
              <ChatCircleDots weight="duotone" className="size-4 text-gold" aria-hidden />
              Talk to her about
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.interests.map((t) => (
                <Chip key={t} className="border-gold/25! bg-plum/40! text-champagne-hi!">
                  {t}
                </Chip>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Her photos</h2>
          <p className="text-sm text-faint">More arrive as you talk</p>
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-1.5 overflow-hidden rounded-card">
          {CROPS.map((crop, i) => (
            <li key={i} className="relative aspect-[4/5] overflow-hidden bg-ink-850">
              <Portrait companion={c} sizes="200px" className={`${crop} ${i < OPEN ? "" : "blur-lg brightness-[1.6] saturate-150"}`} />
              {i >= OPEN && (
                <span className="absolute inset-0 grid place-items-center bg-ink-950/30">
                  <span className="glass grid size-10 place-items-center rounded-full">
                    <LockSimple weight="duotone" className="size-5 text-champagne" aria-hidden />
                  </span>
                  <span className="sr-only">Locked photo</span>
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile: pinned to the thumb. Desktop: inline. */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-linear-to-t from-ink-950 via-ink-950/90 to-transparent px-5 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] md:sticky md:bottom-6 md:mt-12 md:bg-none md:p-0">
          <ButtonLink href={`/app/${c.id}/chat`} size="lg" className="w-full md:w-auto md:px-10">
            <ChatCircleDots weight="fill" className="size-5" aria-hidden />
            Message {c.name}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
