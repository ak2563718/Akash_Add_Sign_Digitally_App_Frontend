import { useEffect, useState } from "react";

// Simulated signature SVG path drawn progressively
const SIGNATURE_PATH =
  "M 20 60 C 30 20, 55 15, 65 45 C 75 70, 60 85, 45 75 C 30 65, 35 40, 55 38 C 75 36, 100 55, 110 70 C 125 90, 130 50, 145 38 C 158 27, 170 42, 175 58 C 180 74, 172 88, 162 80";

function useDashOffset(duration = 2800) {
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      // ease-in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setOffset(1 - eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return offset;
}

function SignatureAnimation() {
  const offset = useDashOffset(2600);

  return (
    <svg
      viewBox="0 0 200 110"
      className="w-48 h-24"
      aria-hidden="true"
      fill="none"
    >
      {/* Ink line */}
      <path
        d={SIGNATURE_PATH}
        stroke="#1a1a2e"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.05s linear" }}
      />
      {/* Nib cursor dot */}
      {offset > 0.01 && (
        <circle r="3.5" fill="#4f46e5" opacity={0.85}>
          <animateMotion
            dur="2.6s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          >
            <mpath xlinkHref="#sig-path" />
          </animateMotion>
        </circle>
      )}
      {/* Hidden path for animateMotion */}
      <path id="sig-path" d={SIGNATURE_PATH} opacity={0} />
    </svg>
  );
}

function PulsingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-1.5 h-1.5 rounded-full bg-indigo-500"
          style={{
            animation: `pulse-dot 1.4s ease-in-out ${i * 0.22}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function DocumentLines() {
  return (
    <div className="w-full space-y-2.5 px-1" aria-hidden="true">
      {[100, 85, 92, 70].map((w, i) => (
        <div
          key={i}
          className="h-2 rounded-full bg-slate-200"
          style={{ width: `${w}%`, opacity: 0.6 + i * 0.05 }}
        />
      ))}
      {/* Signature zone */}
      <div className="mt-5 border-t border-dashed border-slate-300 pt-3 flex items-end justify-between">
        <SignatureAnimation />
        <div className="text-[10px] text-slate-400 font-mono tracking-wide self-end pb-0.5">
          signing…
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);

  const ellipsis = ".".repeat(dots);

  return (
    <div
      className="
        relative bg-white rounded-2xl shadow-2xl shadow-slate-900/15
        w-80 overflow-hidden
        flex flex-col items-center gap-6 p-8
        border border-slate-100
      "
      role="status"
      aria-live="polite"
      aria-label="Applying signature to document"
    >
      {/* Top ambient strip */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-t-2xl" />

      {/* Document mockup */}
      <div className="w-full bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-inner shadow-slate-100">
        {/* Document header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-indigo-600"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 2h7l3 3v9H3V2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M10 2v3h3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 bg-slate-300 rounded-full w-3/4" />
            <div className="h-1.5 bg-slate-200 rounded-full w-1/2" />
          </div>
        </div>
        <DocumentLines />
      </div>

      {/* Status text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-700 tracking-wide">
          Applying your signature{ellipsis}
        </p>
        <p className="text-xs text-slate-400">
          Please wait while we embed it in your PDF
        </p>
      </div>

      {/* Dots */}
      <PulsingDots />
    </div>
  );
}

/* Backdrop overlay — the outermost wrapper simulates the overlay state */
export default function SignLoading() {
  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Simulated page background */}
      <div className="size-full bg-slate-100 flex items-center justify-center relative">
        {/* Semi-transparent backdrop */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

        {/* Card */}
        <div className="relative z-10">
          <LoadingCard />
        </div>
      </div>
    </>
  );
}
