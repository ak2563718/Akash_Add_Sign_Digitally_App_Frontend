import { useState } from "react";
import { Copy, Check, Share2, X, Link } from "lucide-react";

const SHARE_URL = "https://example.com/shared-content?ref=app";

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" fill="#fff" stroke="#E0E0E0" strokeWidth="0.5" />
      <path d="M2 6l10 7L22 6" stroke="#EA4335" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 6v12h4V10.5L12 15l6-4.5V18h4V6" fill="#fff" />
      <path d="M2 6l10 7L22 6" fill="none" stroke="#EA4335" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.424A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      <path d="M8.5 7.5c-.2-.5-.4-.5-.6-.5-.15 0-.32 0-.5.01-.17.01-.45.07-.69.33-.24.26-.93.9-.93 2.2 0 1.3.95 2.55 1.08 2.73.13.18 1.84 2.94 4.54 4 .64.26 1.13.41 1.52.52.64.18 1.22.16 1.68.1.51-.07 1.58-.64 1.8-1.27.22-.62.22-1.15.16-1.26-.07-.12-.25-.19-.52-.33-.27-.14-1.6-.79-1.84-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.85 1.06-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.34-.8-.72-1.34-1.6-1.5-1.87-.15-.27-.02-.41.12-.55.12-.12.27-.32.4-.47.13-.16.18-.27.27-.45.09-.18.04-.33-.02-.47-.06-.14-.6-1.45-.82-1.98z" fill="#fff" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#2AABEE">
      <circle cx="12" cy="12" r="10" />
      <path d="M8.5 12.5l1.5 4.5 1.5-2 3 2 2.5-9-8.5 4.5z" fill="#fff" />
      <path d="M8.5 12.5l5.5-3.5" stroke="#C8DAEA" strokeWidth="0.5" />
    </svg>
  );
}

const shareOptions = [
  {
    id: "gmail",
    label: "Gmail",
    description: "Share via email",
    icon: GmailIcon,
    bg: "bg-red-50 hover:bg-red-100",
    border: "border-red-100 hover:border-red-200",
    getHref: (url: string) =>
      `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Share to a chat",
    icon: WhatsAppIcon,
    bg: "bg-green-50 hover:bg-green-100",
    border: "border-green-100 hover:border-green-200",
    getHref: (url: string) =>
      `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    description: "Post to your feed",
    icon: TwitterXIcon,
    bg: "bg-neutral-100 hover:bg-neutral-200",
    border: "border-neutral-200 hover:border-neutral-300",
    getHref: (url: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    description: "Send to a contact",
    icon: TelegramIcon,
    bg: "bg-sky-50 hover:bg-sky-100",
    border: "border-sky-100 hover:border-sky-200",
    getHref: (url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
];

function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Share2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground leading-tight">Share this page</h2>
              <p className="text-xs text-muted-foreground">Choose how to send</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share options */}
        <div className="px-5 pb-4 grid grid-cols-2 gap-2">
          {shareOptions.map(({ id, label, description, icon: Icon, bg, border, getHref }) => (
            <a
              key={id}
              href={getHref(SHARE_URL)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer group ${bg} ${border}`}
            >
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-white">
                <Icon />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-5 mb-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">or copy link</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* URL copy bar */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
            <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate flex-1 font-mono">
              {SHARE_URL}
            </span>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="size-full flex items-center justify-center bg-background font-['Inter',sans-serif]">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all duration-150"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {open && <ShareModal onClose={() => setOpen(false)} />}
    </div>
  );
}
