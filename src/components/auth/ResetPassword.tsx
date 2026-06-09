'use client'
import { useState } from "react";
import { FileSignature, Eye, EyeOff, ArrowLeft, KeyRound, Check, CheckCircle2 } from "lucide-react";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const passwordStrength = (): { score: number; label: string; color: string } => {
    const score = rules.filter((r) => r.met).length;
    const map = [
      { label: "", color: "transparent" },
      { label: "Weak", color: "#d4183d" },
      { label: "Fair", color: "#f5a623" },
      { label: "Good", color: "#2db55d" },
      { label: "Strong", color: "#2f54eb" },
    ];
    return { score, ...map[score] };
  };

  const strength = passwordStrength();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Minimum 8 characters.";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setSuccess(true); }, 1400);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(47,84,235,0.1)" }}>
            <CheckCircle2 size={32} style={{ color: "#2f54eb" }} />
          </div>
          <h1 style={{ color: "#0f1423", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "1.75rem", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Password reset!
          </h1>
          <p style={{ color: "#6b7694", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
            Your password has been updated successfully. You can now sign in with your new credentials.
          </p>
          <button
            type="button"
            className="w-full py-3 rounded-lg flex items-center justify-center gap-2"
            style={{ background: "#1a2540", color: "#ffffff", fontWeight: 500, fontSize: "0.9rem", border: "none", cursor: "pointer" }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

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
            Password Reset
          </p>
          <h2 style={{ color: "#ffffff", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "2.1rem", lineHeight: 1.25, marginBottom: "1.5rem" }}>
            Choose a strong<br />new password.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "340px", marginBottom: "2.5rem" }}>
            Your new password must be different from previously used passwords. Make it unique and memorable.
          </p>

          {/* Password tips */}
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Password requirements
            </p>
            <div className="flex flex-col gap-3">
              {rules.map(({ label, met }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: met ? "#2f54eb" : "rgba(255,255,255,0.1)" }}
                  >
                    {met && <Check size={11} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ color: met ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)", fontSize: "0.85rem", transition: "color 0.2s" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
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
            className="flex items-center gap-1.5 mb-8 transition-opacity hover:opacity-70"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7694", fontSize: "0.85rem", padding: 0 }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(47,84,235,0.1)" }}>
            <KeyRound size={22} style={{ color: "#2f54eb" }} />
          </div>

          <h1 style={{ color: "#0f1423", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "1.75rem", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Reset password
          </h1>
          <p style={{ color: "#6b7694", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
            Create a new secure password for your account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
                  style={{ background: "#ffffff", border: `1px solid ${errors.password ? "#d4183d" : "rgba(26,37,64,0.15)"}`, color: "#0f1423", fontSize: "0.9rem" }}
                  onFocus={(e) => !errors.password && (e.target.style.borderColor = "#2f54eb")}
                  onBlur={(e) => !errors.password && (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
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

              {/* Strength bar */}
              {password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: i <= strength.score ? strength.color : "rgba(26,37,64,0.1)" }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span style={{ fontSize: "0.72rem", color: strength.color, fontWeight: 500 }}>{strength.label}</span>
                  )}
                </div>
              )}

              {/* Inline rules (mobile) */}
              {password && (
                <div className="flex flex-col gap-1.5 mt-1 lg:hidden">
                  {rules.map(({ label, met }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: met ? "#2f54eb" : "rgba(26,37,64,0.1)" }}
                      >
                        {met && <Check size={9} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ color: met ? "#0f1423" : "#6b7694", fontSize: "0.75rem" }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Confirm new password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                  placeholder="Repeat your new password"
                  className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
                  style={{ background: "#ffffff", border: `1px solid ${errors.confirmPassword ? "#d4183d" : "rgba(26,37,64,0.15)"}`, color: "#0f1423", fontSize: "0.9rem" }}
                  onFocus={(e) => !errors.confirmPassword && (e.target.style.borderColor = "#2f54eb")}
                  onBlur={(e) => !errors.confirmPassword && (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7694", padding: 0 }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && !errors.confirmPassword && confirmPassword === password && (
                <div className="flex items-center gap-1.5">
                  <Check size={12} style={{ color: "#2db55d" }} />
                  <span style={{ color: "#2db55d", fontSize: "0.75rem" }}>Passwords match</span>
                </div>
              )}
              {errors.confirmPassword && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-opacity mt-1"
              style={{ background: "#1a2540", color: "#ffffff", fontWeight: 500, fontSize: "0.9rem", border: "none", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? <span>Updating password…</span> : <><span>Reset password</span><KeyRound size={15} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
