'use client'
import { useCallback, useRef, useState } from "react";
import {
  FileText,
  FileSignature,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { uploadpdf } from "@/redux/features/files/files.Action";
import { useRouter } from "next/navigation";

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfUpload() {
  const [state, setState] = useState<UploadState>("idle");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState("");
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { files } = useAppSelector((state) => state.file)

  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(async (file: File) => {
    setError("");
    // PDF Validation
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      setState("error");
      return;
    }
    // Size Validation (20 MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20 MB.");
      setState("error");
      return;
    }
    setUploadedFile({
      file,
      name: file.name,
      size: formatBytes(file.size),
    });

    setState("uploading");

    try {
      const formData = new FormData();
      // Must match upload.single("file")
      formData.append("file", file);
      const res = await dispatch(uploadpdf(formData)).unwrap()
      setTimeout(() => {
        setState("success");
      }, 3000);
      router.push(`/uploadsign/${res.file.id}`)
    } catch (err) {
      console.error(err);

      setError("Failed to upload file.");
      setState("error");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files?.[0];
      if (file) {
        validateAndSet(file);
      }
    },
    [validateAndSet]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState("dragging");
  };
  const onDragLeave = () => {
    if (state === "dragging") {
      setState("idle");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSet(file);
    }
  };

  const reset = () => {
    setState("idle");
    setUploadedFile(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isDragging = state === "dragging";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isUploading = state === "uploading";
  const isInteractive = !isSuccess && !isUploading;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const dropzoneStateClasses = isDragging
    ? "border-indigo-400 bg-indigo-50/60 shadow-lg shadow-indigo-100 scale-[1.008]"
    : isSuccess
    ? "border-[#2F6B4F]/25 bg-[#F5F9F6] cursor-default"
    : isError
    ? "border-[#9A3324]/25 bg-[#FBF3F1]"
    : isUploading
    ? "border-indigo-200 bg-indigo-50/30 cursor-wait"
    : "border-slate-200 bg-[#FAFAF7] hover:border-indigo-300 hover:bg-indigo-50/30 hover:-translate-y-0.5 hover:shadow-md";

  const perforationColor = isDragging
    ? "#a5b4fc"
    : isError
    ? "#dba79b"
    : isSuccess
    ? "#a9c7b6"
    : "#d8d4c8";

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <div className="mb-2.5 flex items-center justify-center gap-1.5 text-indigo-500">
          <FileSignature size={14} />
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase">
            E-signature
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
          Upload your PDF to sign
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Drop in a contract, form, or agreement — we'll walk you through adding your signature next.
        </p>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => isInteractive && inputRef.current?.click()}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        aria-disabled={!isInteractive}
        aria-label="Upload a PDF document"
        className={[
          "relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border px-6 pt-10 pb-9 transition-all duration-300 select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
          isInteractive ? "cursor-pointer" : "",
          dropzoneStateClasses,
        ].join(" ")}
      >
        {/* perforated stub edge — the "tear here" detail */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-2.5 transition-colors duration-300"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1.4px, transparent 1.6px)",
            backgroundSize: "11px 11px",
            backgroundPosition: "5.5px 4px",
            color: perforationColor,
          }}
        />

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFileChange}
        />

        {(state === "idle" || isDragging) && (
          <>
            <div
              className={[
                "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                isDragging ? "bg-indigo-100" : "bg-slate-100",
              ].join(" ")}
            >
              <FileSignature
                size={24}
                className={isDragging ? "text-indigo-500" : "text-slate-400"}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                {isDragging ? "Drop it to start signing" : "Drag and drop your PDF here"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                or{" "}
                <span className="text-indigo-600 font-medium underline underline-offset-2">
                  browse files
                </span>{" "}
                · PDF only · up to 20 MB
              </p>
            </div>
          </>
        )}

        {isUploading && uploadedFile && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
              <FileText className="text-indigo-500" size={24} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-slate-700 truncate max-w-xs">
                {uploadedFile.name}
              </p>
              <p className="mt-1 text-xs font-mono text-slate-400">
                {uploadedFile.size}
              </p>
            </div>

            <div className="w-full max-w-xs h-1.5 rounded-full bg-indigo-100 overflow-hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400 animate-pulse" />
            </div>

            <p className="flex items-center gap-1.5 text-xs font-medium text-indigo-500">
              <Loader2 size={12} className="animate-spin" />
              Uploading
            </p>
          </>
        )}

        {isSuccess && uploadedFile && (
          <>
            <div className="relative flex h-16 w-16 -rotate-6 items-center justify-center rounded-full border-[3px] border-double border-[#2F6B4F]">
              <CheckCircle2 className="text-[#2F6B4F]" size={26} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-slate-700 truncate max-w-xs">
                {uploadedFile.name}
              </p>
              <p className="mt-0.5 text-xs font-mono text-slate-400">
                {uploadedFile.size}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#2F6B4F]">
                Signed & ready
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              aria-label="Remove file"
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow hover:bg-slate-100"
            >
              <X size={14} className="text-slate-500" />
            </button>
          </>
        )}

        {isError && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9A3324]/10">
              <AlertCircle className="text-[#9A3324]" size={24} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-[#9A3324]">{error}</p>
              <p className="mt-1 text-xs text-slate-400">
                Click to try again, or drag a valid PDF
              </p>
            </div>
          </>
        )}
      </div>

      {isError ? (
        <p className="mt-2 text-xs text-[#9A3324] flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      ) : (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Lock size={12} />
          Encrypted in transit — only you can open this file until you choose to share it.
        </p>
      )}
    </div>
  );
}