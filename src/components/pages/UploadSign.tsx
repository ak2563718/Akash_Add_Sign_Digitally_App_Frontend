'use client'
import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, PenLine, Type, Trash2, GripHorizontal, ChevronLeft, ChevronRight, RotateCcw, Check, X, Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addSignaturetopdf, previewPdf } from "@/redux/features/files/files.Action";
import axios from "axios";
import { Rnd } from "react-rnd";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type SignatureMode = "draw" | "type" | "upload";

interface PlacedSignature {
  id: string;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

const TYPED_FONTS = [
  { label: "Script", style: "'Caveat', cursive", weight: "600" },
  { label: "Italic", style: "Georgia, serif", weight: "400", italic: true },
  { label: "Formal", style: "'Times New Roman', serif", weight: "700" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function DrawCanvas({ onSave, onCancel }: { onSave: (dataUrl: string) => void; onCancel: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      setIsEmpty(false);
    }
    lastPos.current = pos;
  };

  const stopDraw = () => {
    drawing.current = false;
    lastPos.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;
    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-lg overflow-hidden border border-border bg-white">
        <canvas
          ref={canvasRef}
          width={560}
          height={160}
          className="w-full touch-none cursor-crosshair"
          style={{ height: "160px" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-muted-foreground text-sm select-none">Draw your signature here</span>
          </div>
        )}
        <div
          className="absolute bottom-0 left-6 right-6 border-b border-dashed border-muted-foreground/40 pointer-events-none"
          style={{ bottom: "32px" }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw size={13} /> Clear
        </button>
        <div className="flex-1" />
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={isEmpty}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          <Check size={13} /> Apply
        </button>
      </div>
    </div>
  );
}

function TypePanel({ onSave, onCancel }: { onSave: (dataUrl: string) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [selectedFont, setSelectedFont] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const generateDataUrl = (): string | null => {
    if (!name.trim()) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const font = TYPED_FONTS[selectedFont];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${font.italic ? "italic " : ""}${font.weight} 52px ${font.style}`;
    ctx.fillStyle = "#1a1a2e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 200, 65);
    return canvas.toDataURL("image/png");
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Type your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="grid grid-cols-3 gap-2">
        {TYPED_FONTS.map((f, i) => (
          <button
            key={i}
            onClick={() => setSelectedFont(i)}
            className={`px-2 py-3 rounded-lg border text-center transition-all ${
              selectedFont === i
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <span
              style={{
                fontFamily: f.style,
                fontWeight: f.weight,
                fontStyle: f.italic ? "italic" : "normal",
                fontSize: "18px",
                color: "#1a1a2e",
                display: "block",
                lineHeight: 1.4,
              }}
            >
              {name || "Sign"}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 block">{f.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        <button
          onClick={() => {
            const url = generateDataUrl();
            if (url) onSave(url);
          }}
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          <Check size={13} /> Apply
        </button>
      </div>
    </div>
  );
}

function UploadPanel({ onSave, onCancel }: { onSave: (dataUrl: string) => void; onCancel: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-3">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg h-36 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <Upload size={22} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Drop an image here or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, SVG — transparent background recommended</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border bg-[#f8f8f8] h-36 flex items-center justify-center">
          <img src={preview} alt="Signature preview" className="max-h-full max-w-full object-contain p-4" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-white shadow text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        <button
          onClick={() => preview && onSave(preview)}
          disabled={!preview}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          <Check size={13} /> Apply
        </button>
      </div>
    </div>
  );
}

function DraggableSignature({
  sig,
  onMove,
  onDelete,
  isSelected,
  onSelect,
}: {
  sig: PlacedSignature;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(sig.id);
    dragging.current = true;
    offset.current = { x: e.clientX - sig.x, y: e.clientY - sig.y };

    const onMove_ = (ev: MouseEvent) => {
      if (!dragging.current) return;
      onMove(sig.id, ev.clientX - offset.current.x, ev.clientY - offset.current.y);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove_);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove_);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{ left: sig.x, top: sig.y, width: sig.width, height: sig.height }}
      className={`absolute cursor-grab active:cursor-grabbing group select-none ${
        isSelected ? "ring-2 ring-primary ring-offset-1" : "hover:ring-2 hover:ring-primary/40 hover:ring-offset-1"
      }`}
    >
      <img src={sig.dataUrl} alt="Signature" className="w-full h-full object-contain" draggable={false} />
      {isSelected && (
        <>
          <div className="absolute -top-5 left-0 right-0 flex justify-center">
            <GripHorizontal size={14} className="text-primary" />
          </div>
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(sig.id); }}
            className="absolute -top-2 -right-2 p-0.5 rounded-full bg-destructive text-destructive-foreground shadow"
          >
            <X size={10} />
          </button>
        </>
      )}
    </div>
  );
}
type props ={
  searchby:string
}
export default function UploadSign({searchby}:props) {
  const [activeMode, setActiveMode] = useState<SignatureMode | null>(null);
  const [placed, setPlaced] = useState<PlacedSignature[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const dispatch = useAppDispatch();
  const { files, loading, isDownload, downloadurl } = useAppSelector((state)=>state.file)

  useEffect(()=>{
     dispatch(previewPdf(searchby))
  },[searchby,dispatch])
  console.log(loading, isDownload, downloadurl)
  const pdfUrl =files.fileurl;
  const handleSaveSignature = (dataUrl: string) => {
    const pdfRect = pdfRef.current?.getBoundingClientRect();
    const x = pdfRect ? pdfRect.left + 80 : 200;
    const y = pdfRect ? pdfRect.top + 120 : 300;
    const newSig: PlacedSignature = {
      id: generateId(),
      dataUrl,
      x,
      y,
      width: 180,
      height: 60,
      page: currentPage,
    };
    setPlaced((prev) => [...prev, newSig]);
    setSelectedId(newSig.id);
    setActiveMode(null);
  };

  const handleMove = (id: string, x: number, y: number) => {
    setPlaced((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
  };

  const handleDelete = (id: string) => {
    setPlaced((prev) => prev.filter((s) => s.id !== id));
    setSelectedId(null);
  };

  const currentPageSigs = placed.filter((s) => s.page === currentPage);

  const handleSave = async () => {
  try {
    const payload = {
      pdfId: searchby, // assuming searchby is your pdfId

      signatures: placed.map((sig) => ({
        page: sig.page , // pdf-lib uses page numbers starting from 1
        x: sig.x,
        y: sig.y,
        width: sig.width,
        height: sig.height,
        signatureImage: sig.dataUrl,
      })),
    };

    // console.log("========== PDF SIGN REQUEST ==========");
    // console.log(payload);
    // console.log(
    //   JSON.stringify(payload, null, 2)
    // );
    // console.log("=====================================");
    await dispatch(addSignaturetopdf(payload))
  } catch (error) {
    console.error(error);
  }
};

const handleDownload = async () => {
  try {
    if (!downloadurl) return;

    const response = await fetch(downloadurl);

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "signed-document.pdf";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div
      className="flex h-[1250px] bg-[#e8e8ec] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
      onClick={() => setSelectedId(null)}
    >
      
   <div className="h-[1250px] flex-1 flex flex-col bg-[#e8e8ec] overflow-hidden">

  {/* Top Toolbar */}
  <div className="flex items-center justify-center gap-4 py-4 border-b bg-white shadow-sm">
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
    >
      <ChevronLeft size={20} />
    </button>

    <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium">
      {currentPage} / {numPages}
    </div>

    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(numPages, p + 1))
      }
      disabled={currentPage === numPages}
      className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
    >
      <ChevronRight size={20} />
    </button>
    {isDownload && <div className="ml-200">
      <button onClick={handleDownload}>
        <Download className="ml-6"/>
        Download
      </button>
    </div>}
  </div>

  {/* PDF Area */}
  <div className="flex-1 overflow-auto flex justify-center p-8">

    <div
      ref={pdfRef}
      className="relative bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="p-10 text-center">
            Loading PDF...
          </div>
        }
      >
        <Page
          pageNumber={currentPage}
          width={800}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {currentPageSigs
        .filter((sig) => sig.page === currentPage)
        .map((sig) => (
         
          <DraggableSignature
            key={sig.id}
            sig={sig}
            onMove={handleMove}
            onDelete={handleDelete}
            isSelected={selectedId === sig.id}
            onSelect={setSelectedId}
          />
        ))}
    </div>

  </div>
</div>

      {/* Right Sidebar */}
      <div
        className="w-[320px] flex-shrink-0 bg-white border-l border-border flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
          <h2 className="text-sm font-semibold text-foreground">Add Signature</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Place signatures anywhere on the document</p>
        </div>

        {/* Mode Tabs */}
        <div className="px-4 pt-4 flex-shrink-0">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-lg">
            {(
              [
                { id: "draw", icon: PenLine, label: "Draw" },
                { id: "type", icon: Type, label: "Type" },
                { id: "upload", icon: Upload, label: "Upload" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveMode(activeMode === id ? null : id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeMode === id
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Panel */}
        <div className="px-4 pt-4 flex-shrink-0">
          {activeMode === "draw" && (
            <DrawCanvas onSave={handleSaveSignature} onCancel={() => setActiveMode(null)} />
          )}
          {activeMode === "type" && (
            <TypePanel onSave={handleSaveSignature} onCancel={() => setActiveMode(null)} />
          )}
          {activeMode === "upload" && (
            <UploadPanel onSave={handleSaveSignature} onCancel={() => setActiveMode(null)} />
          )}
          {activeMode === null && (
            <div className="h-10 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Select a method above to add a signature</p>
            </div>
          )}
        </div>
         

        {/* Divider */}
        <div className="mx-4 mt-4 border-t border-border" />

        {/* Placed Signatures List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wide uppercase">
              Placed Signatures
            </h3>
            {placed.length > 0 && (
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {placed.length}
              </span>
            )}
          </div>
         

          {placed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <PenLine size={16} className="text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                No signatures yet. Create one above and it will appear on the document.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {placed.map((sig) => (
                <div
                  key={sig.id}
                  onClick={() => {
                    if (sig.page !== currentPage) setCurrentPage(sig.page);
                    setSelectedId(sig.id);
                  }}
                  className={`group flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedId === sig.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="w-16 h-10 rounded bg-[#f8f8f8] border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={sig.dataUrl} alt="Sig" className="max-w-full max-h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">Signature</p>
                    <p className="text-[10px] text-muted-foreground">Page {sig.page + 1}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(sig.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {placed.length > 0 && (
          <div className="px-4 py-4 border-t border-border flex-shrink-0">
            <button onClick={handleSave} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Save & Finalize Document
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              This will lock all signatures and generate the final PDF
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
