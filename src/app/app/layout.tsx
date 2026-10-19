import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { AgeGate } from "@/components/landing/client";

export const metadata: Metadata = { title: "Amora" };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <AgeGate />
      <div className="grain room min-h-dvh">
        <AppNav />
        <div className="relative z-[2] md:pl-64">{children}</div>
      </div>
    </>
  );
}
