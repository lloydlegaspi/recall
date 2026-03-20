"use client";

import { Layers3, FileText } from "lucide-react";

type ContextDocument = {
  id?: number;
  content?: string;
  source_file?: string | null;
  page_number?: number | null;
  similarity?: number;
};

type ContextPanelProps = {
  data?: any[];
};

export default function ContextPanel({ data }: ContextPanelProps) {
  const latestContextBlock = data
    ?.slice()
    .reverse()
    .find(
      (d) =>
        d?.source === "context" ||
        d?.data?.source === "context" ||
        (Array.isArray(d) && d[0]?.source === "context")
    );

  let activeDocuments: ContextDocument[] = [];
  if (latestContextBlock) {
    activeDocuments = (
      latestContextBlock.documents ||
      latestContextBlock.data?.documents ||
      latestContextBlock[0]?.documents ||
      []
    ) as ContextDocument[];
  }

  return (
    <section className="h-full w-full rounded-3xl border border-white bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="flex h-full flex-col">
        <header className="mb-5 flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-white bg-white/70 text-slate-700 backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            <Layers3 className="size-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Active Context
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Retrieved notes backing your answer
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeDocuments.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 p-6 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Ask a question to search your knowledge base.
            </div>
          ) : (
            <div className="space-y-3 pb-1">
              {activeDocuments.map((doc, index) => {
                const sourceFile = doc.source_file?.trim() || "Unknown source";
                const pageNumber = doc.page_number ?? "?";
                const similarity = typeof doc.similarity === "number" ? Math.round(doc.similarity * 100) : null;
                const isHighMatch = (doc.similarity ?? 0) > 0.55; 

                return (
                  <article
                    key={doc.id ?? `${sourceFile}-${index}`}
                    className="rounded-2xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex items-start gap-2">
                        <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                          <FileText className="size-4" />
                        </span>
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {sourceFile}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-slate-300/80 bg-slate-100/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-200">
                          Page {pageNumber}
                        </span>
                        {similarity !== null ? (
                          <span
                            className={[
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              isHighMatch
                                ? "border border-emerald-300/70 bg-emerald-100/80 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "border border-indigo-300/70 bg-indigo-100/80 text-indigo-800 dark:border-indigo-400/40 dark:bg-indigo-500/10 dark:text-indigo-300",
                            ].join(" ")}
                          >
                            Match {similarity}%
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {doc.content ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                        {doc.content}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}