import Link from "next/link";
import { ArrowLeft, MessageSquare, Brain, Files } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkspaceChat from "@/app/components/workspace/WorkspaceChat";
import WorkspaceQuiz from "@/app/components/workspace/WorkspaceQuiz";
import WorkspaceDocuments from "@/app/components/workspace/WorkspaceDocuments";

type WorkspaceProps = {
  params: Promise<{ subject: string }>;
  searchParams?: Promise<{ tab?: string }>;
};

// Notice: No "use client" at the top! This is a pure Server Component.
export default async function StudyWorkspacePage({ params, searchParams }: WorkspaceProps) {
  // We simply await the params on the server
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const decodedSubject = decodeURIComponent(resolvedParams.subject);
  const requestedTab = resolvedSearchParams?.tab;
  const defaultTab =
    requestedTab === "quiz" || requestedTab === "documents" || requestedTab === "chat"
      ? requestedTab
      : "chat";

  return (
    <div className="w-full px-6 md:px-12">
      {/* Header & Breadcrumb */}
      <div className="mb-8 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Hub
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {decodedSubject}
        </h1>
      </div>

      {/* The Workspace Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 h-auto w-max rounded-2xl bg-white/50 p-1.5 shadow-sm backdrop-blur-md dark:bg-slate-900/50 dark:border-white/5 dark:border">
          <TabsTrigger
            value="chat"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <MessageSquare className="size-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Brain className="size-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Files className="size-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents (Placeholders) */}
        <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
          <WorkspaceChat subject={decodedSubject} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-0 focus-visible:outline-none">
          <WorkspaceQuiz subject={decodedSubject} />
        </TabsContent>

        <TabsContent value="documents" className="mt-0 focus-visible:outline-none">
          <WorkspaceDocuments subject={decodedSubject} />
        </TabsContent>
      </Tabs>
    </div>
  );
}