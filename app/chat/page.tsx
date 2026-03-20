import { redirect } from "next/navigation";

import ChatInterface from "@/app/components/chat/ChatInterface";
import ContextPanel from "@/app/components/chat/ContextPanel";

type PageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function ChatPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams ?? {});
  const rawSubject = params.subject;
  const subject = Array.isArray(rawSubject) ? rawSubject[0]?.trim() : rawSubject?.trim();

  if (!subject) {
    redirect("/");
  }

  return (
    <section className="flex h-[calc(100vh-100px)] gap-6 p-6">
      <div className="w-[40%]">
        <ContextPanel />
      </div>

      <div className="w-[60%]">
        <ChatInterface subject={subject} />
      </div>
    </section>
  );
}
