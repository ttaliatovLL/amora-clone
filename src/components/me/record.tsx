"use client";

import { MotionConfig, motion } from "motion/react";
import { AchievementIcon } from "@/components/achievement-icon";
import { cx } from "@/components/ui";
import { achievements } from "@/lib/achievements";
import { useSyncExternalStore } from "react";
import { useProgress } from "@/lib/progress";

const noop = () => () => {};

const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

/** The record: every achievement as a collectible card. Earned ones are lit, locked ones wait in the dark with how far along you are. */
export function Record() {
  const p = useProgress();
  // Some values read the clock (streaks), which Next forbids during prerender: compute them in the browser only.
  const client = useSyncExternalStore(noop, () => true, () => false);
  const rows = achievements.map((a) => ({ a, date: p.earned[a.id], value: client ? Math.min(a.value(p), a.target) : 0 }));
  const earned = rows.filter((r) => r.date).length;
  const next = rows.filter((r) => !r.date).sort((x, y) => y.value / y.a.target - x.value / x.a.target)[0];

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 className="font-display text-head">Your record</h2>
          <p className="mt-4 max-w-[44ch] text-body text-muted">
            Small things you did here, kept for you.
            {next && (
              <>
                {" "}
                Closest next: <span className="text-paper">{next.a.title}</span>, {next.a.how.toLowerCase().replace(/\.$/, "")}.
              </>
            )}
          </p>
        </div>
        <div>
          <p className="font-display text-[clamp(3rem,1rem+7vw,7rem)] leading-[0.92] whitespace-nowrap tabular" aria-label={`${earned} of ${achievements.length} earned`}>
            {earned} of {achievements.length}
          </p>
          <div className="mt-4 flex gap-1" aria-hidden>
            {rows.map((r, i) => (
              <motion.span
                key={r.a.id}
                className={cx("h-2 flex-1 origin-left", r.date ? "bg-rouge" : "bg-ink-4")}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {rows.map(({ a, date, value }) => (
          <li
            key={a.id}
            className={cx("reveal flex min-h-56 flex-col p-4 sm:min-h-64 sm:p-5", date ? "bg-ink-3" : "bg-ink-2")}
          >
            <span className={cx("grid size-12 place-items-center sm:size-14", date ? "bg-rouge text-ink" : "bg-ink-4 text-faint")}>
              <AchievementIcon name={a.icon} size={24} weight={date ? "fill" : "regular"} />
            </span>
            <div className="mt-auto pt-6">
              <h3 className={cx("font-display text-[clamp(0.8rem,3.3vw,1.2rem)] [overflow-wrap:break-word]", date ? "text-paper" : "text-muted")}>{a.title}</h3>
              <p className={cx("mt-2 text-small", date ? "text-paper/80" : "text-faint")}>{a.how}</p>
              {date ? (
                <p className="mt-3 text-small text-rouge tabular">Earned {day(date)}</p>
              ) : (
                <div className="mt-3">
                  <div className="h-1 bg-ink-4" role="progressbar" aria-label={`${a.title} progress`} aria-valuemin={0} aria-valuemax={a.target} aria-valuenow={value}>
                    <motion.div
                      className="h-full origin-left bg-paper/70"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: value / a.target }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="mt-2 text-small text-faint tabular">
                    {value} / {a.target}
                  </p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </MotionConfig>
  );
}
