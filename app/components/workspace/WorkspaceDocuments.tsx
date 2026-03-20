"use client";

import { useEffect, useState } from "react";
import { FileText, ExternalLink, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

type WorkspaceDocumentsProps = {
  subject: string;
};

export default function WorkspaceDocuments({ subject }: WorkspaceDocumentsProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resolvedFolder, setResolvedFolder] = useState("");

  function getFolderCandidates(rawSubject: string): string[] {
    const trimmed = rawSubject.trim();
    const lowercase = trimmed.toLowerCase();
    const spacedToHyphen = trimmed.replace(/\s+/g, "-");
    const slugged = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return Array.from(
      new Set([trimmed, lowercase, spacedToHyphen, slugged].filter((value) => value.length > 0))
    );
  }

  function filterVisibleFiles(input: any[]): any[] {
    return input.filter((file) => {
      const fileName = (file?.name ?? "").toLowerCase();

      if (!fileName) {
        return false;
      }

      if (fileName.startsWith(".")) {
        return false;
      }

      if (fileName.includes("emptyfolderplaceholder")) {
        return false;
      }

      return true;
    });
  }

  async function fetchFiles() {
    setIsLoading(true);
    setError(null);

    const folderCandidates = getFolderCandidates(subject);
    let firstError: string | null = null;
    let hadSuccessfulList = false;

    for (const folder of folderCandidates) {
      const { data, error: listError } = await supabase.storage
        .from("study-materials")
        .list(folder);

      if (listError) {
        if (!firstError) {
          firstError = listError.message;
        }
        continue;
      }

      hadSuccessfulList = true;
      const visibleFiles = filterVisibleFiles(data ?? []);

      if (visibleFiles.length > 0) {
        setFiles(visibleFiles);
        setResolvedFolder(folder);
        setIsLoading(false);
        return;
      }
    }

    setFiles([]);
    setResolvedFolder(folderCandidates[0] ?? subject);
    if (!hadSuccessfulList && firstError) {
      setError(firstError);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void fetchFiles();
  }, [subject]);

  async function uploadFiles(fileList: FileList | File[]) {
    const selectedFiles = Array.from(fileList);

    if (!selectedFiles.length) {
      return;
    }

    setIsUploading(true);
    setError(null);

    const failedUploads: string[] = [];
    const folderCandidates = getFolderCandidates(subject);
    const targetFolder = resolvedFolder || folderCandidates[folderCandidates.length - 1] || subject;

    for (const file of selectedFiles) {
      const filePath = `${targetFolder}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("study-materials")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("SUPABASE UPLOAD ERROR:", uploadError);
        failedUploads.push(file.name);
      }
    }

    // 1. Fetch files FIRST (which resets errors to null)
    await fetchFiles(); 
    
    // 2. Set the error SECOND so it survives the refresh and stays on screen!
    if (failedUploads.length) {
      setError(`Failed to upload: ${failedUploads.join(", ")}`);
    }

    setIsUploading(false);
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    void uploadFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void uploadFiles(event.dataTransfer.files);
  }

  return (
    <section className="min-h-[65vh] w-full max-w-5xl mx-auto">
      <div className="space-y-6">
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={[
            "rounded-3xl border border-dashed p-7 text-center backdrop-blur-xl transition-colors",
            isDragging
              ? "border-indigo-400 bg-indigo-50/60 dark:border-indigo-300 dark:bg-indigo-500/10"
              : "border-white bg-white/50 dark:border-white/10 dark:bg-white/5",
          ].join(" ")}
        >
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            Drop file/s here to upload
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            or select files from your device
          </p>

          <div className="mt-4">
            <label
              htmlFor="workspace-documents-upload"
              className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
            >
              Choose Files
            </label>
            <input
              id="workspace-documents-upload"
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Bucket path: {resolvedFolder || subject}
          </p>

          {isUploading ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Uploading files...</p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex min-h-[44vh] items-center justify-center rounded-3xl border border-white bg-white/60 p-10 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div>
              <Loader2 className="mx-auto size-9 animate-spin text-indigo-500" />
              <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-200">Loading documents...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[44vh] items-center justify-center rounded-3xl border border-rose-200 bg-rose-50/70 p-10 text-center shadow-xl backdrop-blur-xl dark:border-rose-400/30 dark:bg-rose-500/10">
            <p className="font-medium text-rose-700 dark:text-rose-200">{error}</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex min-h-[44vh] items-center justify-center rounded-3xl border border-white bg-white/60 p-10 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="font-medium text-slate-600 dark:text-slate-300">
              No documents found in the study-materials bucket for this subject.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {files.map((file) => {
              const activeFolder = resolvedFolder || subject;
              const publicUrl = supabase.storage
                .from("study-materials")
                .getPublicUrl(`${activeFolder}/${file.name}`).data.publicUrl;

              return (
                <article
                  key={file.name}
                  className="group flex flex-col justify-between rounded-2xl border border-white bg-white/50 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    <span className="inline-flex size-10 items-center justify-center rounded-xl border border-white bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      <FileText className="size-5" />
                    </span>
                    <p className="mt-3 truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {file.name}
                    </p>
                  </div>

                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
                  >
                    Open File
                    <ExternalLink className="size-4" />
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
