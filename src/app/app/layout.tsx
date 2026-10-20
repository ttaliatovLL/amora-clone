import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { AgeGate } from "@/components/landing/client";

export const metadata: Metadata = { title: "Amora" };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <AgeGate />
      <div className="min-h-dvh bg-ink">
        <AppNav />
        <div className="relative pb-28 md:pb-0">{children}</div>
      </div>
    </>
  );
}
