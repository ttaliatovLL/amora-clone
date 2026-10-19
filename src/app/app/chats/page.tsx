import Link from "next/link";
import { Avatar } from "@/components/ui";
import { companions } from "@/lib/companions";

// shortcut: mock inbox until conversations are stored server-side.
const inbox = [
  { id: "emma", last: "tell me a 2am thought, i'll trade u one of mine", when: "1:04", unread: 1 },
  { id: "gina", last: "we lost on a question about eels. here, proof of the swim", when: "Yesterday", unread: 0 },
  { id: "margot", last: "You: That gallery sounds perfect", when: "Mon", unread: 0 },
].map((m) => ({ ...m, c: companions.find((c) => c.id === m.id)! }));

export default function Chats() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-28 sm:px-8 md:pt-10">
      <h1 className="font-display text-[clamp(2.5rem,8vw,4rem)] leading-[0.92]">Your <em className="text-champagne">chats</em></h1>
      <ul className="mt-6 divide-y divide-line">
        {inbox.map(({ c, last, when, unread }) => (
          <li key={c.id}>
            <Link href={`/app/${c.id}/chat`} className="-mx-3 flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-ivory/[0.04] active:bg-ivory/[0.06]">
              <Avatar companion={c} size="md" />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-xl">{c.name}</span>
                  <span className="shrink-0 text-xs text-faint tabular-nums">{when}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-3">
                  <span className={`truncate text-sm ${unread ? "text-ivory" : "text-muted"}`}>{last}</span>
                  {unread > 0 && (
                    <span className="ml-auto grid size-5 shrink-0 place-items-center foil rounded-full text-[0.6875rem] font-semibold" aria-label={`${unread} unread`}>
                      {unread}
                    </span>
                  )}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-faint">
        Want someone new?{" "}
        <Link href="/app" className="text-champagne underline underline-offset-4">
          Discover companions
        </Link>
      </p>
    </main>
  );
}
