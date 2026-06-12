'use client'
import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { FileSignature, ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userVerifyOtp } from "@/redux/features/auth/auth.Action";
import toast from "react-hot-toast";

export function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(59);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { loading, error, message, isSentOtp } = useAppSelector((state)=>state.auth);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = [...otp];
    text.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(text.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = otp.join("");
      const res = await dispatch(userVerifyOtp(code)).unwrap();
      toast.success(res.message)
      setOtp(["", "", "", "", "", ""]);
      router.push('/reset-password');
    } catch (error) {
      console.error(error)
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResend = async() => {
    if (resendCooldown > 0) return;
    setResending(true);
    await dispatch(userVerifyOtp(otp.join(""))).unwrap();
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setTimeout(() => { setResending(false); setResendCooldown(59); }, 1000);
  };

  if(!isSentOtp){
   return router.push('/forgot-password')
  }

//   const maskedEmail = email?.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c);

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
            Identity Verification
          </p>
          <h2 style={{ color: "#ffffff", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "2.1rem", lineHeight: 1.25, marginBottom: "1.5rem" }}>
            One code<br />to confirm it's you.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "340px" }}>
            We sent a 6-digit verification code to your email. Enter it within 5 minutes to proceed.
          </p>

          {/* OTP visual */}
          <div className="mt-12 rounded-xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={16} style={{ color: "#2f54eb" }} />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>Secure one-time password</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: i <= 3 ? "rgba(47,84,235,0.25)" : "rgba(255,255,255,0.07)",
                    border: `1px solid ${i <= 3 ? "rgba(47,84,235,0.5)" : "rgba(255,255,255,0.1)"}`,
                    color: i <= 3 ? "#fff" : "transparent",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                  }}
                >
                  {i <= 3 ? "·" : ""}
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginTop: "1rem" }}>
              Code expires in 10:00 · Do not share this code
            </p>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>© 2026 SignPDF · All rights reserved</p>
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
          <button
            type="button"
            onClick={()=>router.push('/forgot-password')}
            className="flex items-center gap-1.5 mb-8 transition-opacity hover:opacity-70"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7694", fontSize: "0.85rem", padding: 0 }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(47,84,235,0.1)" }}>
            <ShieldCheck size={22} style={{ color: "#2f54eb" }} />
          </div>

          <h1 style={{ color: "#0f1423", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "1.75rem", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Check your email
          </h1>
          <p style={{ color: "#6b7694", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
            We sent a 6-digit code to{" "}
            <span style={{ color: "#0f1423", fontWeight: 500 }}>{}</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* OTP inputs */}
            <div className="flex gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="w-12 sm:w-14 h-14 rounded-xl text-center outline-none transition-all shrink-0"
                  style={{
                    background: digit ? "#ffffff" : "#ffffff",
                    border: `2px solid ${error ? "#d4183d" : digit ? "#2f54eb" : "rgba(26,37,64,0.15)"}`,
                    color: "#0f1423",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    caretColor: "#2f54eb",
                  }}
                  onFocus={(e) => { if (!error) e.target.style.borderColor = "#2f54eb"; }}
                  onBlur={(e) => { if (!digit && !error) e.target.style.borderColor = "rgba(26,37,64,0.15)"; }}
                />
              ))}
            </div>

            {error && (
              <p style={{ color: "#d4183d", fontSize: "0.82rem", background: "rgba(212,24,61,0.06)", padding: "0.6rem 0.9rem", borderRadius: "0.4rem", marginTop: "-8px",textAlign:'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-opacity"
              style={{ background: "#2f54eb", color: "#ffffff", fontWeight: 500, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <span>Verifying…</span> : <><span>Verify code</span><ShieldCheck size={15} /></>}
            </button>
          </form>

          {/* Resend */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <span style={{ color: "#6b7694", fontSize: "0.85rem" }}>Didn't receive it?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending}
              className="flex items-center gap-1 transition-opacity"
              style={{ background: "none", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", color: resendCooldown > 0 ? "#6b7694" : "#2f54eb", fontWeight: 500, fontSize: "0.85rem", padding: 0, opacity: resendCooldown > 0 ? 0.6 : 1 }}
            >
              {resending && <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />}
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>

          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
