"use client";

import { BookmarkSimple } from "@phosphor-icons/react";
import { toggleSaved, useProgress } from "@/lib/progress";
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Save her to your board. Square ink tab over the photo; fills rouge when saved. */
export function SaveButton({ id, name, className, label }: { id: string; name: string; className?: string; label?: boolean }) {
  const saved = useProgress().saved.includes(id);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from your board` : `Save ${name} to your board`}
      onClick={() => toggleSaved(id, name)}
      className={cx(
        "press inline-flex items-center justify-center gap-2",
        // The label button keeps one width for Save and Saved, so nothing beside it shifts on tap.
        // Same box as Button size md (44 tall, 20px gutters, body text, 18px icon) so the two pair side by side.
        label ? "h-11 min-w-[7.5rem] px-5 text-body font-medium" : "size-10",
        saved ? "bg-rouge text-ink hover:bg-rouge-hi" : label ? "bg-ink-4 text-paper hover:bg-ink-5 active:bg-ink-5" : "bg-ink/60 text-paper hover:bg-ink/80",
        className,
      )}
    >
      <BookmarkSimple size={18} weight={saved ? "fill" : "regular"} className="shrink-0" aria-hidden />
      {label && (saved ? "Saved" : "Save")}
    </button>
  );
}
