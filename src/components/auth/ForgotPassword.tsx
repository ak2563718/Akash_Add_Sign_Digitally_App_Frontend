'use client'
import { useState } from "react";
import { FileSignature, ArrowRight, ArrowLeft, Mail } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-14" style={{ background: "#1a2540", fontFamily: "'Inter', sans-serif" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#2f54eb" }}>
            <FileSignature size={18} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>SignPDF</span>
        </div>

        <div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Account Recovery
          </p>
          <h2 style={{ color: "#ffffff", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "2.1rem", lineHeight: 1.25, marginBottom: "1.5rem" }}>
            Locked out?<br />We've got you.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "340px" }}>
            Enter the email address linked to your account and we'll send you a one-time code to reset your password securely.
          </p>

          {/* Illustration */}
          <div className="mt-12 rounded-xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(47,84,235,0.2)" }}>
                <Mail size={17} style={{ color: "#2f54eb" }} />
              </div>
              <div>
                <p style={{ color: "#fff", fontWeight: 500, fontSize: "0.85rem" }}>Check your inbox</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>OTP valid for 10 minutes</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[90, 70, 80].map((w, i) => (
                <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex-1 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontSize: "1.1rem", fontWeight: 600 }}>
                  ·
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>
          © 2026 SignPDF · All rights reserved
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center px-8 py-14" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1a2540" }}>
            <FileSignature size={15} color="#fff" />
          </div>
          <span style={{ fontWeight: 600, color: "#1a2540" }}>SignPDF</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Back */}
          <button
            type="button"
            
            className="flex items-center gap-1.5 mb-8 transition-opacity hover:opacity-70"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7694", fontSize: "0.85rem", padding: 0 }}
          >
            <ArrowLeft size={14} />
            Back to sign in
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(47,84,235,0.1)" }}>
            <Mail size={22} style={{ color: "#2f54eb" }} />
          </div>

          <h1 style={{ color: "#0f1423", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "1.75rem", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Forgot password?
          </h1>
          <p style={{ color: "#6b7694", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
            No worries. Enter your email and we'll send a 6-digit OTP to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{ background: "#ffffff", border: `1px solid ${error ? "#d4183d" : "rgba(26,37,64,0.15)"}`, color: "#0f1423", fontSize: "0.9rem" }}
                onFocus={(e) => !error && (e.target.style.borderColor = "#2f54eb")}
                onBlur={(e) => !error && (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
              />
              {error && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-opacity"
              style={{ background: "#2f54eb", color: "#ffffff", fontWeight: 500, fontSize: "0.9rem", border: "none", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? <span>Sending OTP…</span> : <><span>Send reset code</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#6b7694", fontSize: "0.85rem", marginTop: "2rem" }}>
            Remember your password?{" "}
            <button
              type="button"
              style={{ color: "#2f54eb", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
