"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      className={`rise fixed inset-x-3 z-[90] mx-auto max-w-[440px] bg-ink-3 p-5 text-paper shadow-[var(--shadow-float)] md:inset-x-auto md:right-6 md:bottom-6 md:mx-0 ${
        inApp ? "bottom-[calc(env(safe-area-inset-bottom)+104px)]" : "bottom-[calc(env(safe-area-inset-bottom)+12px)]"
      }`}
    >
      <p className="font-display text-[15px]">Cookies, kept quiet</p>
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
        <button className="press h-11 bg-ink-5 text-small font-medium" onClick={() => done({ analytics: false, personal: false }, "Only essential cookies")}>
          Essential only
        </button>
        {details ? (
          <button className="press h-11 bg-paper text-small font-medium text-ink" onClick={() => done(choice, "Cookie choices saved")}>
            Save choices
          </button>
        ) : (
          <button className="press h-11 bg-paper text-small font-medium text-ink" onClick={() => done({ analytics: true, personal: true }, "All cookies on")}>
            Accept all
          </button>
        )}
      </div>
      {!details && (
        <button className="mt-3 text-small text-muted underline underline-offset-4 hover:text-paper" onClick={() => setDetails(true)}>
          Choose what to allow
        </button>
      )}
    </section>
  );
}

function Row({ label, note, on, disabled, onToggle }: { label: string; note: string; on: boolean; disabled?: boolean; onToggle?: () => void }) {
  return (
    <label className={`flex items-center gap-4 bg-ink-2 px-3.5 py-3 ${disabled ? "" : "cursor-pointer"}`}>
      <span className="min-w-0 flex-1">
        <span className="block text-small font-medium">{label}</span>
        <span className="block text-small text-muted">{note}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={onToggle}
        className={`relative h-6 w-10 shrink-0 transition-colors duration-200 ${on ? "bg-rouge" : "bg-ink-5"} disabled:opacity-60`}
      >
        <span className={`absolute top-1 left-1 size-4 bg-paper transition-transform duration-200 ease-[var(--ease-out)] ${on ? "translate-x-4" : ""}`} />
      </button>
    </label>
  );
}
