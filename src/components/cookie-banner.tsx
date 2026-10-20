"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Switch } from "@/components/ui";

const COOKIE = "amora_consent";
const OPEN_EVENT = "amora:cookies";

type Choice = { analytics: boolean; personal: boolean };

/** Reopen the consent panel from anywhere (footer, settings). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function save(c: Choice) {
  document.cookie = `${COOKIE}=${c.analytics ? "a" : ""}${c.personal ? "p" : ""}-; max-age=15552000; path=/; samesite=lax`;
}

/** Consent, the private way: nothing optional is on until the member turns it on, and refusing is one tap. */
export function CookieBanner() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [choice, setChoice] = useState<Choice>({ analytics: false, personal: false });

  useEffect(() => {
    const m = document.cookie.match(/amora_consent=([ap]*)-/);
    // Reading a cookie set outside React: the banner can only decide after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!m) setOpen(true);
    else setChoice({ analytics: m[1].includes("a"), personal: m[1].includes("p") });
    const reopen = () => (setOpen(true), setDetails(true));
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;
  const done = (c: Choice, msg: string) => {
    save(c);
    setChoice(c);
    setOpen(false);
    setDetails(false);
    toast(msg);
  };
  const inApp = path.startsWith("/app") && !path.endsWith("/chat");

  return (
    <section
      aria-label="Cookies"
      className={`rise fixed inset-x-4 z-[90] mx-auto max-w-[26rem] bg-ink-3 p-5 text-paper shadow-[var(--shadow-float)] md:inset-x-auto md:right-8 md:bottom-8 md:mx-0 ${
        inApp ? "bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.75rem)]" : "bottom-[calc(env(safe-area-inset-bottom)+1rem)]"
      }`}
    >
      <p className="font-display text-[0.9375rem]">Cookies, kept quiet</p>
      <p className="mt-2 text-small text-muted">
        We use essential cookies to keep you signed in and remember your age check. Anything else stays off unless you turn it on.
      </p>
      {details && (
        <div className="mt-4 grid gap-1">
          <Row label="Essential" note="Sign-in, age check, your settings." on disabled />
          <Row label="Analytics" note="Anonymous counts of which screens are used." on={choice.analytics} onToggle={() => setChoice((c) => ({ ...c, analytics: !c.analytics }))} />
          <Row label="Personalised picks" note="Order the board by who you talk to." on={choice.personal} onToggle={() => setChoice((c) => ({ ...c, personal: !c.personal }))} />
        </div>
      )}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" className="bg-ink-5 hover:bg-[#3a3a3a]" onClick={() => done({ analytics: false, personal: false }, "Only essential cookies")}>
          Essential only
        </Button>
        {details ? (
          <Button variant="paper" size="sm" onClick={() => done(choice, "Cookie choices saved")}>
            Save choices
          </Button>
        ) : (
          <Button variant="paper" size="sm" onClick={() => done({ analytics: true, personal: true }, "All cookies on")}>
            Accept all
          </Button>
        )}
      </div>
      {!details && (
        <button className="press mt-3 text-small text-muted underline decoration-faint underline-offset-4 hover:text-paper hover:decoration-paper" onClick={() => setDetails(true)}>
          Choose what to allow
        </button>
      )}
    </section>
  );
}

function Row({ label, note, on, disabled, onToggle }: { label: string; note: string; on: boolean; disabled?: boolean; onToggle?: () => void }) {
  return (
    <div className="flex items-center gap-4 bg-ink-2 px-4 py-3">
      <span className="min-w-0 flex-1">
        <span className="block text-small font-medium">{label}</span>
        <span className="block text-small text-muted">{note}</span>
      </span>
      <Switch label={label} on={on} disabled={disabled} onChange={onToggle} />
    </div>
  );
}
