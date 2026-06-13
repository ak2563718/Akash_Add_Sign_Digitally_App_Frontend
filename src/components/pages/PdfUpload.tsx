'use client'
import { useCallback, useRef, useState } from "react";
import {
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
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
  const { files } = useAppSelector((state)=>state.file) 

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
      router.push(`/previewpdf/${res.file.id}`)
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

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="mb-2 text-sm font-medium text-gray-700">
        Upload PDF
      </p>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() =>
          !isSuccess &&
          !isUploading &&
          inputRef.current?.click()
        }
        className={[
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-200 cursor-pointer select-none",
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : isSuccess
            ? "border-green-400 bg-green-50 cursor-default"
            : isError
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40",
        ].join(" ")}
      >
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
                isDragging ? "bg-blue-100" : "bg-gray-100",
              ].join(" ")}
            >
              <Upload
                size={26}
                className={
                  isDragging
                    ? "text-blue-500"
                    : "text-gray-400"
                }
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {isDragging
                  ? "Drop your PDF here"
                  : "Drag & drop your PDF here"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                or{" "}
                <span className="text-blue-500 underline underline-offset-2">
                  browse files
                </span>{" "}
                · PDF only · max 20 MB
              </p>
            </div>
          </>
        )}

        {isUploading && uploadedFile && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <FileText
                className="text-blue-500"
                size={26}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {uploadedFile.name}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {uploadedFile.size}
              </p>
            </div>

            <div className="w-full max-w-xs h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-full" />
            </div>

            <p className="text-xs text-blue-500">
              Uploading...
            </p>
          </>
        )}

        {isSuccess && uploadedFile && (
          <>
            <CheckCircle
              className="text-green-500"
              size={40}
            />

            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {uploadedFile.name}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                {uploadedFile.size}
              </p>

              <p className="mt-1 text-xs text-green-600 font-medium">
                Uploaded successfully
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
            >
              <X
                size={14}
                className="text-gray-500"
              />
            </button>
          </>
        )}

        {isError && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle
                className="text-red-500"
                size={26}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Click to try again or drag a valid PDF
              </p>
            </div>
          </>
        )}
      </div>

      {isError && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}