'use client'
import { useState } from "react";
import { Eye, EyeOff, FileSignature, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    // Simulated auth
    setTimeout(() => {
      setIsLoading(false);
      setError("Invalid credentials. Try demo@signpdf.com / password123");
    }, 1200);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex flex-col justify-between p-14"
        style={{ background: "#1a2540", fontFamily: "'Inter', sans-serif" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "#2f54eb" }}
          >
            <FileSignature size={18} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
            SignPDF
          </span>
        </div>

        {/* Hero copy */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Document Signing Platform
          </p>
          <h2 style={{ color: "#ffffff", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "2.25rem", lineHeight: 1.25, marginBottom: "2rem" }}>
            Sign, seal, and<br />send in seconds.
          </h2>
          <div className="flex flex-col gap-4">
            {[
              "Place signatures anywhere on any PDF",
              "Legally binding e-signatures",
              "Audit trail & timestamp certificates",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 size={16} style={{ color: "#2f54eb", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative PDF mockup */}
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", marginLeft: "4px" }}>
              contract_2026.pdf
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {[100, 85, 92, 60].map((w, i) => (
              <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
          <div
            className="mt-5 px-4 py-2 rounded-lg inline-flex items-center gap-2"
            style={{ background: "#2f54eb", color: "#fff", fontSize: "0.8rem", fontWeight: 500 }}
          >
            <FileSignature size={13} />
            Sarah Johnson — signed Jun 8, 2026
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="flex flex-col justify-center items-center px-8 py-14"
        style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1a2540" }}>
            <FileSignature size={15} color="#fff" />
          </div>
          <span style={{ fontWeight: 600, color: "#1a2540" }}>SignPDF</span>
        </div>

        <div className="w-full max-w-sm">
          <h1 style={{ color: "#0f1423", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "1.75rem", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Welcome back
          </h1>
          <p style={{ color: "#6b7694", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
            Sign in to your SignPDF account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.01em" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(26,37,64,0.15)",
                  color: "#0f1423",
                  fontSize: "0.9rem",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2f54eb")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.01em" }}>
                  Password
                </label>
                <button
                  type="button"
                  style={{ color: "#2f54eb", fontSize: "0.82rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(26,37,64,0.15)",
                    color: "#0f1423",
                    fontSize: "0.9rem",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2f54eb")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7694", padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "#d4183d", fontSize: "0.82rem", background: "rgba(212,24,61,0.06)", padding: "0.6rem 0.9rem", borderRadius: "0.4rem" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-opacity"
              style={{
                background: "#1a2540",
                color: "#ffffff",
                fontWeight: 500,
                fontSize: "0.9rem",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(26,37,64,0.1)" }} />
              <span style={{ color: "#6b7694", fontSize: "0.78rem" }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(26,37,64,0.1)" }} />
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(26,37,64,0.15)",
                color: "#0f1423",
                fontWeight: 500,
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#6b7694", fontSize: "0.85rem", marginTop: "2rem" }}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={()=>router.push('/signup')}
              style={{ color: "#2f54eb", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Create one free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
