import { CaretLeft, ChatCircleDots, Clock, Globe, LockSimple, MapPin, Moon, Sparkle } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { Portrait } from "@/components/portrait";
import { ButtonLink, Chip, OnlinePill, Tags } from "@/components/ui";
import { bios, companions } from "@/lib/companions";

export function generateStaticParams() {
  return companions.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/[id]">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  return { title: c ? `${c.name} · Amora` : "Amora" };
}

// shortcut: her portrait and one gallery shot, re-cropped per tile, until her real gallery exists. First two open, rest locked.
const CROPS = ["", "", "scale-[1.35] origin-[30%_70%]", "scale-[1.5] origin-[70%_40%]", "scale-[1.25] origin-[50%_90%]", "scale-[1.9] origin-[45%_30%]"];
const OPEN = 2;

// Suspense gives navigation an instant shell while params resolve.
export default function Profile({ params }: PageProps<"/app/[id]">) {
  return (
    <Suspense fallback={<div className="h-[78svh] bg-ink-900 md:h-dvh md:w-1/2" />}>
      <ProfileBody params={params} />
    </Suspense>
  );
}

async function ProfileBody({ params }: Pick<PageProps<"/app/[id]">, "params">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  if (!c) notFound();
  const facts = [
    { Icon: Moon, label: c.sign },
    { Icon: Globe, label: c.langs.join(" · ") },
    { Icon: Clock, label: c.online ? "Replies in ~1 min" : "Back tonight" },
  ];
  const shots = CROPS.map((crop, i) => ({ crop, src: i % 2 ? c.gallery[0] : undefined }));

  return (
    <main className="pb-36 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:pb-0">
      {/* Portrait: full-bleed on phones with a slow parallax drift, sticky column on desktop. */}
      <div className="relative md:sticky md:top-0 md:h-dvh">
        <div className="relative h-[78svh] overflow-hidden md:h-full">
          <ViewTransition name={`portrait-${c.id}`} share="morph" default="none">
            <div className="drift absolute inset-0 origin-top">
              <Portrait companion={c} priority sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </ViewTransition>
          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent via-40% to-ink-950" />
        </div>
        <Link
          href="/app"
         
          aria-label="Back to discover"
          className="glass absolute top-[max(1rem,env(safe-area-inset-top))] left-4 grid size-11 place-items-center rounded-full text-ivory transition-transform active:scale-90"
        >
          <CaretLeft weight="bold" className="size-[1.125rem]" aria-hidden />
        </Link>
        <div className="drift-out absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 md:pb-10">
          {c.online && <OnlinePill label="Online now" className="mb-4" />}
          <h1 className="font-display text-[clamp(3.5rem,16vw,6.5rem)] leading-[0.88] tracking-[-0.045em] [overflow-wrap:anywhere]">
            {c.name}
            <span className="ml-3 text-[0.4em] font-normal tracking-[-0.02em] text-ivory/55">{c.age}</span>
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-ivory/70">
            <MapPin weight="regular" className="size-4" aria-hidden />
            {c.city}
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 sm:px-8 md:py-20 md:pr-12">
        <ul className="reveal flex flex-wrap gap-2" aria-label="Quick facts">
          {facts.map(({ Icon, label }) => (
            <li key={label} className="glass inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[0.8125rem] text-ivory/90">
              <Icon weight="regular" className="size-4 text-blush" aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <p className="reveal mt-8 font-display text-[1.75rem] leading-[1.15] tracking-[-0.03em] text-balance md:text-4xl">{c.tagline}.</p>
        {bios[c.id] && <p className="reveal mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-muted">{bios[c.id]}</p>}
        <Tags tags={c.tags} max={4} className="reveal mt-5 [mask-image:none] [&_li]:bg-white/[0.06] [&_li]:px-2.5 [&_li]:py-1 [&_li]:text-[0.8125rem]" />

        <section className="reveal mt-12 border-t border-line pt-6">
          <h2 className="flex items-center gap-2 text-[0.8125rem] font-medium text-muted">
            <Sparkle weight="regular" className="size-4" aria-hidden />
            Personality
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.traits.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </section>

        {c.interests.length > 0 && (
          <section className="reveal mt-8 border-t border-line pt-6">
            <h2 className="flex items-center gap-2 text-[0.8125rem] font-medium text-muted">
              <ChatCircleDots weight="regular" className="size-4" aria-hidden />
              Talk to her about
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.interests.map((t) => (
                <Chip key={t} className="border-blush/20 bg-blush/[0.07] text-blush-hi">
                  {t}
                </Chip>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 border-t border-line pt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Her photos</h2>
            <p className="text-[0.8125rem] text-faint tabular-nums">{c.photos} in her gallery</p>
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-1.5">
            {shots.map(({ crop, src }, i) => (
              <li key={i} className={`reveal relative overflow-hidden rounded-2xl bg-ink-850 ${i === 0 ? "col-span-2 row-span-2" : "aspect-[4/5]"}`}>
                <Portrait companion={c} src={src} sizes={i === 0 ? "400px" : "200px"} className={`${crop} ${i < OPEN ? "" : "blur-xl brightness-[1.3] saturate-150"}`} />
                {i >= OPEN && (
                  <span className="absolute inset-0 grid place-items-center bg-ink-950/25">
                    <span className="glass grid size-10 place-items-center rounded-full">
                      <LockSimple weight="fill" className="size-4 text-ivory" aria-hidden />
                    </span>
                    <span className="sr-only">Locked photo</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.8125rem] text-faint">More arrive as you talk.</p>
        </section>

        {/* Mobile: pinned to the thumb. Desktop: inline. */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-linear-to-t from-ink-950 via-ink-950/85 to-transparent px-5 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))] md:sticky md:bottom-6 md:mt-12 md:bg-none md:p-0">
          <ButtonLink href={`/app/${c.id}/chat`} size="lg" className="w-full md:w-auto md:px-10">
            <ChatCircleDots weight="fill" className="size-5" aria-hidden />
            Message {c.name}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
