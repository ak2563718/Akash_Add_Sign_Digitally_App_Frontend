'use client'
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  X,
  FileText,
} from "lucide-react";

interface PdfPreviewProps {
  file: File;
  onClose?: () => void;
}

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

export function PdfPreview({ file, onClose }: PdfPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState<number | null>(null);

  const objectUrl = URL.createObjectURL(file);

  const zoomIndex = ZOOM_LEVELS.indexOf(zoom);
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1;
  const canZoomOut = zoomIndex > 0;

  const handleZoomIn = () => canZoomIn && setZoom(ZOOM_LEVELS[zoomIndex + 1]);
  const handleZoomOut = () => canZoomOut && setZoom(ZOOM_LEVELS[zoomIndex - 1]);
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        {/* File info */}
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={16} className="text-blue-500 shrink-0" />
          <span className="text-sm text-gray-700 truncate max-w-[200px]">
            {file.name}
          </span>
          <span className="text-xs text-gray-400 shrink-0">
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Zoom out */}
          <ToolbarButton
            onClick={handleZoomOut}
            disabled={!canZoomOut}
            title="Zoom out"
          >
            <ZoomOut size={15} />
          </ToolbarButton>

          {/* Zoom level */}
          <span className="text-xs text-gray-600 w-10 text-center tabular-nums">
            {zoom}%
          </span>

          {/* Zoom in */}
          <ToolbarButton
            onClick={handleZoomIn}
            disabled={!canZoomIn}
            title="Zoom in"
          >
            <ZoomIn size={15} />
          </ToolbarButton>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Rotate */}
          <ToolbarButton onClick={handleRotate} title="Rotate 90°">
            <RotateCw size={15} />
          </ToolbarButton>

          {/* Download */}
          <ToolbarButton onClick={handleDownload} title="Download">
            <Download size={15} />
          </ToolbarButton>

          {/* Close */}
          {onClose && (
            <>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarButton onClick={onClose} title="Close preview">
                <X size={15} />
              </ToolbarButton>
            </>
          )}
        </div>
      </div>

      {/* PDF viewer */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <div
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
            width: rotation % 180 !== 0 ? "auto" : "100%",
          }}
        >
          <div className="shadow-xl rounded overflow-hidden bg-white">
            <iframe
              key={objectUrl}
              src={`${objectUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title="PDF Preview"
              className="w-full"
              style={{
                // A4 aspect ratio at 100% zoom inside the container
                height: "calc(100vw * 1.414)",
                maxHeight: "80vh",
                minHeight: "500px",
                display: "block",
                border: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer status bar */}
      <div className="flex items-center justify-center gap-3 px-4 py-2 bg-white border-t border-gray-200 shrink-0">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="disabled:opacity-30 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs text-gray-500 tabular-nums">
          Page {currentPage}
          {totalPages ? ` of ${totalPages}` : ""}
        </span>
        <button
          onClick={() =>
            setCurrentPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))
          }
          disabled={totalPages !== null && currentPage >= totalPages}
          className="disabled:opacity-30 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
