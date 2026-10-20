import Image from "next/image";
import { Sketch } from "@/components/sketch";
import type { Companion } from "@/lib/companions";

/** Fills its positioned parent with her portrait; falls back to the line-art sketch when there is no photo. */
export function Portrait({
  companion: c,
  face,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority,
  src,
  className = "",
}: {
  companion: Companion;
  /** Another photo of her (gallery); defaults to the portrait. */
  src?: string;
  /** Crop to the face (avatars). */
  face?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!c.photo)
    return <Sketch name={c.name} hair={c.hair} wash={c.wash} crop={face ? "face" : "portrait"} className={`absolute inset-0 size-full ${className}`} />;
  return (
    <Image
      src={src ?? c.photo}
      alt={`Portrait of ${c.name}`}
      fill
      sizes={face ? "96px" : sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      className={`object-cover ${face ? "object-[50%_18%] scale-[1.6] origin-[50%_22%]" : "object-[50%_28%]"} ${className}`}
    />
  );
}
