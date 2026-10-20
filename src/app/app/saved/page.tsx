import type { Metadata } from "next";
import { SavedBoard } from "@/components/board/saved-board";

export const metadata: Metadata = { title: "Saved · Amora" };

export default function Saved() {
  return <SavedBoard />;
}
