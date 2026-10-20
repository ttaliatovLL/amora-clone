"use client";

import { MotionConfig, motion } from "motion/react";
import { AchievementIcon } from "@/components/achievement-icon";
import { cx } from "@/components/ui";
import { achievements } from "@/lib/achievements";
import { useSyncExternalStore } from "react";
import { useProgress } from "@/lib/progress";

const noop = () => () => {};

const day = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
};

/** The record: every achievement as a collectible card. Earned ones are printed on paper, like a comp card you get to keep;
 *  locked ones wait in the dark with how far along you are, and the closest one is lit rouge. */
export function Record() {
  const p = useProgress();
  // Some values read the clock (streaks), which Next forbids during prerender: compute them in the browser only.
  const client = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const rows = achievements.map((a) => ({
    a,
    date: p.earned[a.id],
    value: client ? Math.min(a.value(p), a.target) : 0,
  }));
  const earned = rows.filter((r) => r.date).length;
  const next = rows
    .filter((r) => !r.date)
    .sort((x, y) => y.value / y.a.target - x.value / x.a.target)[0];

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
        <div>
          <h2 className="font-display text-head">Your record</h2>
          <p className="mt-3 max-w-[44ch] text-body text-muted md:mt-4">
            Small things you did here, kept for you.
            {next && (
              <>
                {" "}
                Closest next: <span className="text-paper">{next.a.title}</span>
                , {next.a.how.toLowerCase().replace(/\.$/, "")}.
              </>
            )}
          </p>
        </div>
        <div>
          <p
            className="font-display text-[clamp(2.25rem,1rem+5vw,4.75rem)] leading-[0.92] whitespace-nowrap tabular"
            aria-label={`${earned} of ${achievements.length} earned`}
          >
            {earned} of {achievements.length}
          </p>
          <div className="mt-3 flex gap-1" aria-hidden>
            {rows.map((r, i) => (
              <motion.span
                key={r.a.id}
                className={cx(
                  "h-1.5 flex-1 origin-left",
                  r.date ? "bg-rouge" : "bg-ink-4",
                )}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-8 lg:grid-cols-4 xl:grid-cols-6">
        {rows.map(({ a, date, value }) => {
          const closest = a.id === next?.a.id && value > 0;
          return (
            <li
              key={a.id}
              className={cx(
                "reveal relative flex min-h-48 flex-col overflow-hidden p-4 md:min-h-52",
                date ? "bg-paper text-ink" : "bg-ink-2",
              )}
            >
              <span
                className={cx(
                  "relative grid size-10 place-items-center",
                  date
                    ? "bg-rouge text-ink"
                    : closest
                      ? "bg-ink-4 text-paper"
                      : "bg-ink-3 text-faint",
                )}
              >
                <AchievementIcon
                  name={a.icon}
                  size={20}
                  weight={date ? "fill" : "regular"}
                />
              </span>
              {/* The earned mark: her icon struck large into the corner of the card, like a stamp on a kept ticket. */}
              {date && (
                <span
                  className="pointer-events-none absolute -top-6 -right-6 text-ink/[0.045]"
                  aria-hidden
                >
                  <AchievementIcon name={a.icon} size={132} weight="fill" />
                </span>
              )}
              <div className="relative mt-auto pt-5">
                <h3
                  className={cx(
                    "font-display text-[clamp(0.75rem,0.6rem+0.6vw,1rem)] leading-[1.05] [overflow-wrap:break-word]",
                    date || closest ? "" : "text-muted",
                  )}
                >
                  {a.title}
                </h3>
                <p
                  className={cx(
                    "mt-1.5 text-small",
                    date ? "text-ink/70" : "text-faint",
                  )}
                >
                  {a.how}
                </p>
                {date ? (
                  <p className="mt-3 text-small font-medium text-rouge-lo tabular">
                    Earned {day(date)}
                  </p>
                ) : (
                  <div className="mt-3">
                    <div
                      className="h-1 bg-ink-4"
                      role="progressbar"
                      aria-label={`${a.title} progress`}
                      aria-valuemin={0}
                      aria-valuemax={a.target}
                      aria-valuenow={value}
                    >
                      <motion.div
                        className={cx(
                          "h-full origin-left",
                          closest ? "bg-rouge" : "bg-paper/60",
                        )}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: value / a.target }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.9,
                          delay: 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </div>
                    <p
                      className={cx(
                        "mt-2 text-small tabular",
                        closest ? "text-paper" : "text-faint",
                      )}
                    >
                      {value} / {a.target}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}
