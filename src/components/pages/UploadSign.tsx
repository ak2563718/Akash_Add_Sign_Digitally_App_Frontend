'use client'
import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, PenLine, Type, Trash2, GripHorizontal, ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react";

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

const PDF_PAGES = [
  {
    title: "Service Agreement",
    content: [
      { type: "header", text: "SERVICE AGREEMENT" },
      { type: "date", text: "Effective Date: June 14, 2026" },
      { type: "section", text: "1. PARTIES" },
      { type: "body", text: "This Service Agreement (\"Agreement\") is entered into as of the date above by and between Meridian Design Studio LLC, a Delaware limited liability company (\"Service Provider\"), and the undersigned client (\"Client\")." },
      { type: "section", text: "2. SCOPE OF SERVICES" },
      { type: "body", text: "Service Provider agrees to provide the following services: UI/UX design, front-end engineering, and delivery of production-ready assets as described in the attached Statement of Work (Exhibit A), incorporated herein by reference." },
      { type: "section", text: "3. PAYMENT TERMS" },
      { type: "body", text: "Client shall pay Service Provider a fixed project fee of $12,500 USD. Payment is due in two installments: 50% upon execution of this Agreement, and 50% upon final delivery of deliverables." },
      { type: "section", text: "4. INTELLECTUAL PROPERTY" },
      { type: "body", text: "Upon receipt of full payment, all deliverables shall become the sole and exclusive property of Client. Service Provider retains the right to display the work in its portfolio." },
    ],
  },
  {
    title: "Terms & Signatures",
    content: [
      { type: "section", text: "5. CONFIDENTIALITY" },
      { type: "body", text: "Each party agrees to keep confidential all non-public information disclosed by the other party and to use such information solely for purposes of this Agreement." },
      { type: "section", text: "6. LIMITATION OF LIABILITY" },
      { type: "body", text: "In no event shall Service Provider be liable for any indirect, incidental, special, or consequential damages. Service Provider's total liability shall not exceed the total fees paid under this Agreement." },
      { type: "section", text: "7. GOVERNING LAW" },
      { type: "body", text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions." },
      { type: "signature-block", parties: ["Service Provider", "Client"] },
    ],
  },
];

export default function UploadSign() {
  const [activeMode, setActiveMode] = useState<SignatureMode | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [placed, setPlaced] = useState<PlacedSignature[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

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
  const page = PDF_PAGES[currentPage];

  return (
    <div
      className="flex h-screen bg-[#e8e8ec] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
      onClick={() => setSelectedId(null)}
    >
      {/* PDF Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-12 bg-[#2c2c3a] flex items-center px-4 gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-white/50 text-xs font-medium tracking-wide">
            <span className="text-white/80">SERVICE AGREEMENT.pdf</span>
            <span className="mx-2">·</span>
            <span>{placed.length} signature{placed.length !== 1 ? "s" : ""} placed</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-white/70 text-xs tabular-nums">
              {currentPage + 1} / {PDF_PAGES.length}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(PDF_PAGES.length - 1, p + 1))}
              disabled={currentPage === PDF_PAGES.length - 1}
              className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* PDF Canvas */}
        <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-6">
          <div
            ref={pdfRef}
            className="relative bg-white shadow-[0_4px_32px_rgba(0,0,0,0.18)] w-full max-w-2xl"
            style={{ minHeight: "860px" }}
          >
            {/* PDF Content */}
            <div className="p-14 pt-16">
              <div className="border-b-2 border-[#1a1a2e] pb-4 mb-8">
                <div className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium mb-1">MERIDIAN DESIGN STUDIO</div>
                <div className="text-[10px] text-muted-foreground">Confidential · Page {currentPage + 1} of {PDF_PAGES.length}</div>
              </div>

              {page.content.map((block, i) => {
                if (block.type === "header") {
                  return (
                    <h1 key={i} className="text-2xl font-bold text-[#1a1a2e] mb-2 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                      {block.text}
                    </h1>
                  );
                }
                if (block.type === "date") {
                  return <p key={i} className="text-sm text-muted-foreground mb-8">{block.text}</p>;
                }
                if (block.type === "section") {
                  return (
                    <h2 key={i} className="text-xs font-bold tracking-[0.12em] text-[#1a1a2e] uppercase mt-7 mb-2">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "body") {
                  return (
                    <p key={i} className="text-sm text-[#3a3a4a] leading-relaxed mb-3">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "signature-block") {
                  return (
                    <div key={i} className="mt-12 grid grid-cols-2 gap-12">
                      {block.parties?.map((party, pi) => (
                        <div key={pi}>
                          <div className="h-14 border-b border-[#1a1a2e] mb-2" />
                          <p className="text-xs font-semibold text-[#1a1a2e] tracking-wide">{party}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Date: _______________</p>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Draggable Signatures */}
            {currentPageSigs.map((sig) => (
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
            <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
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
