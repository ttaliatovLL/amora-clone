import type { Metadata } from "next";
import { Discover } from "@/components/discover/discover";

export const metadata: Metadata = { title: "Discover · Amora" };

export default function DiscoverPage() {
  return <Discover />;
}
