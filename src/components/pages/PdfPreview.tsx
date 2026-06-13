'use client'
import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
  RotateCw,
  FileText,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { previewPdf } from "@/redux/features/files/files.Action";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function IconButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-8 h-8 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
type props={
  searchby: string
}
export default function PreviewPdf({searchby}:props) {
  const [file, setFile] = useState<File | string | null>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [inputPage, setInputPage] = useState<string>("1");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("tracemonkey-pldi-09.pdf");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  
 useEffect(() => {
  const fetchPdf = async () => {
    try {
      const res = await dispatch(previewPdf(searchby)).unwrap();
      setFile(res.file.fileurl);
    } catch (error) {
      console.error(error);
    }
  };
  fetchPdf();
}, [searchby, dispatch]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage("1");
    setLoading(false);
  };

  const goToPrev = () => {
    const p = Math.max(1, pageNumber - 1);
    setPageNumber(p);
    setInputPage(String(p));
  };

  const goToNext = () => {
    const p = Math.min(numPages, pageNumber + 1);
    setPageNumber(p);
    setInputPage(String(p));
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const commitPageInput = () => {
    const n = parseInt(inputPage, 10);
    if (!isNaN(n) && n >= 1 && n <= numPages) {
      setPageNumber(n);
    } else {
      setInputPage(String(pageNumber));
    }
  };

  const zoomIn = () => setScale((s) => Math.min(3, parseFloat((s + 0.25).toFixed(2))));
  const zoomOut = () => setScale((s) => Math.max(0.5, parseFloat((s - 0.25).toFixed(2))));
  const rotate = () => setRotation((r) => (r + 90) % 360);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setLoading(true);
      setPageNumber(1);
      setInputPage("1");
      setScale(1.0);
      setRotation(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setFileName(dropped.name);
      setLoading(true);
      setPageNumber(1);
      setInputPage("1");
      setScale(1.0);
      setRotation(0);
    }
  }, []);

  const handleDownload = () => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else if (typeof file === "string") {
      window.open(file, "_blank");
    }
  };
  return (
    <div className="min-h-screen bg-[#f0f0ee] flex flex-col items-center py-8 px-4 font-[Inter,sans-serif]">
      {/* Viewer */}
      <div className="w-full max-w-5xl">
        {!file ? (
          /* Drop zone */
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-24 transition-colors cursor-default ${
              isDragging
                ? "border-primary/60 bg-primary/5"
                : "border-border bg-white/50"
            }`}
          >
            <FileText className="w-10 h-10 text-foreground/20" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground/60">
                Drop a PDF here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or use the Open PDF button above
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-xl border border-border/60 shadow-sm">
              {/* Navigation */}
              <IconButton onClick={goToPrev} disabled={pageNumber <= 1} title="Previous page">
                <ChevronLeft className="w-4 h-4" />
              </IconButton>

              <div className="flex items-center gap-1.5 mx-1">
                <input
                  type="text"
                  value={inputPage}
                  onChange={handlePageInput}
                  onBlur={commitPageInput}
                  onKeyDown={(e) => e.key === "Enter" && commitPageInput()}
                  className="w-10 text-center text-xs font-medium bg-accent rounded px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-ring font-[JetBrains_Mono,monospace]"
                />
                <span className="text-xs text-muted-foreground font-[JetBrains_Mono,monospace]">
                  / {numPages || "—"}
                </span>
              </div>

              <IconButton onClick={goToNext} disabled={pageNumber >= numPages} title="Next page">
                <ChevronRight className="w-4 h-4" />
              </IconButton>

              <div className="w-px h-5 bg-border mx-1" />

              {/* Zoom */}
              <IconButton onClick={zoomOut} disabled={scale <= 0.5} title="Zoom out">
                <ZoomOut className="w-4 h-4" />
              </IconButton>

              <button
                onClick={() => setScale(1.0)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground w-12 text-center font-[JetBrains_Mono,monospace] py-1 rounded hover:bg-accent transition-colors"
                title="Reset zoom"
              >
                {Math.round(scale * 100)}%
              </button>

              <IconButton onClick={zoomIn} disabled={scale >= 3} title="Zoom in">
                <ZoomIn className="w-4 h-4" />
              </IconButton>

              <div className="w-px h-5 bg-border mx-1" />

              {/* Rotate */}
              <IconButton onClick={rotate} title="Rotate 90°">
                <RotateCw className="w-4 h-4" />
              </IconButton>
            </div>

            {/* PDF canvas */}
            <div
              className="overflow-auto rounded-xl shadow-md"
              style={{ maxHeight: "100vh" }}
            >
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadStart={() => setLoading(true)}
                loading={
                  <div className="flex items-center justify-center w-[595px] h-[842px] bg-white rounded-xl">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                      <span className="text-xs font-medium font-[JetBrains_Mono,monospace]">Loading PDF…</span>
                    </div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center w-[595px] h-[400px] bg-white rounded-xl">
                    <div className="flex flex-col items-center gap-2 text-destructive">
                      <X className="w-8 h-8 opacity-50" />
                      <span className="text-sm font-medium">Failed to load PDF</span>
                      <span className="text-xs text-muted-foreground">The file may be corrupted or invalid</span>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  className="rounded-xl overflow-hidden shadow-sm"
                  loading={
                    <div
                      className="flex items-center justify-center bg-white"
                      style={{ width: Math.round(595 * scale), height: Math.round(842 * scale) }}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    </div>
                  }
                />
              </Document>
            </div>

            {/* Page indicator dots — shown only when ≤ 20 pages */}
            {numPages > 1 && numPages <= 20 && (
              <div className="flex items-center gap-1.5 py-1">
                {Array.from({ length: numPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPageNumber(i + 1); setInputPage(String(i + 1)); }}
                    className={`rounded-full transition-all ${
                      i + 1 === pageNumber
                        ? "w-4 h-2 bg-primary"
                        : "w-2 h-2 bg-primary/20 hover:bg-primary/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
