import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Chat } from "@/components/chat";
import { companions } from "@/lib/companions";

export function generateStaticParams() {
  return companions.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/[id]/chat">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  return { title: c ? `${c.name} · Chat · Amora` : "Amora" };
}

export default function ChatPage({ params }: PageProps<"/app/[id]/chat">) {
  return (
    <Suspense fallback={<div className="h-dvh" />}>
      <ChatBody params={params} />
    </Suspense>
  );
}

async function ChatBody({ params }: Pick<PageProps<"/app/[id]/chat">, "params">) {
  const { id } = await params;
  const c = companions.find((x) => x.id === id);
  if (!c) notFound();
  return <Chat companion={c} />;
}
