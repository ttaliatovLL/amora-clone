import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { Silk } from "@/components/silk";
import { AgeGate } from "@/components/landing/client";

export const metadata: Metadata = { title: "Amora" };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <AgeGate />
      <div className="relative min-h-dvh bg-ink">
        {/* The landing's silk carries into the app as a soft light at the top of every screen; it scrolls away with the page.
            Lives in the layout so navigating between screens keeps one WebGL context. */}
        <Silk className="silk-band pointer-events-none absolute inset-x-0 top-0 h-[70svh] bg-transparent! opacity-70 [mask-image:linear-gradient(180deg,#000_0%,rgb(0_0_0/0.5)_45%,transparent_100%)]" />
        <AppNav />
        <div className="relative pb-28 md:pb-0">{children}</div>
      </div>
    </>
  );
}
