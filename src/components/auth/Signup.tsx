'use client'
import { useState } from "react";
import { Eye, EyeOff, FileSignature, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userSignup } from "@/redux/features/auth/auth.Action";
import toast from "react-hot-toast";
export function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    username:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state)=>state.auth)

  const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
    if (!pw) return { score: 0, label: "", color: "transparent" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: "", color: "transparent" },
      { label: "Weak", color: "#d4183d" },
      { label: "Fair", color: "#f5a623" },
      { label: "Good", color: "#2db55d" },
      { label: "Strong", color: "#2f54eb" },
    ];
    return { score, ...map[score] };
  };

  const strength = passwordStrength(form.password);


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res =await dispatch(userSignup(form)).unwrap();
      toast.success(res.message);
      setForm({
        name:'',
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
      })
      router.replace('/login')
    } catch (error) {
      console.error(error)
    }
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    background: "#ffffff",
    border: `1px solid ${hasError ? "#d4183d" : "rgba(26,37,64,0.15)"}`,
    color: "#0f1423",
    fontSize: "0.9rem",
  });

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-14"
        style={{ background: "#1a2540", fontFamily: "'Inter', sans-serif" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#2f54eb" }}>
            <FileSignature size={18} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
            SignPDF
          </span>
        </div>

        {/* Steps */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Get started in minutes
          </p>
          <h2 style={{ color: "#ffffff", fontFamily: "'Lora', serif", fontWeight: 500, fontSize: "2.1rem", lineHeight: 1.25, marginBottom: "2.5rem" }}>
            Your first signature<br />is just ahead.
          </h2>
          <div className="flex flex-col gap-6">
            {[
              { step: "01", title: "Create your account", desc: "Free forever. No credit card required." },
              { step: "02", title: "Upload your PDF", desc: "Drag and drop or browse your files." },
              { step: "03", title: "Add your signature", desc: "Draw, type, or upload your signature." },
              { step: "04", title: "Download & share", desc: "Get your signed document instantly." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(47,84,235,0.2)", color: "#2f54eb", fontSize: "0.7rem", fontWeight: 700 }}
                >
                  {step}
                </div>
                <div>
                  <p style={{ color: "#ffffff", fontWeight: 500, fontSize: "0.88rem", marginBottom: "2px" }}>{title}</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex gap-4 flex-wrap">
          {["SOC 2 Certified", "GDPR Compliant", "256-bit SSL"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Check size={11} style={{ color: "#2f54eb" }} />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
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
            Create your account
          </h1>
          <p style={{ color: "#6b7694", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Free plan · No credit card needed
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
                placeholder="Sarah Johnson"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={inputStyle(!!errors.name)}
                onFocus={(e) => !errors.name && (e.target.style.borderColor = "#2f54eb")}
                onBlur={(e) => !errors.name && (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
              />
              {errors.name && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.name}</p>}
            </div>

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => field("username", e.target.value)}
                placeholder="name123"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={inputStyle(!!errors.username)}
                onFocus={(e) => !errors.username && (e.target.style.borderColor = "#2f54eb")}
                onBlur={(e) => !errors.username && (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
              />
              {errors.username && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Work email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
                placeholder="sarah@company.com"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={inputStyle(!!errors.email)}
                onFocus={(e) => !errors.email && (e.target.style.borderColor = "#2f54eb")}
                onBlur={(e) => !errors.email && (e.target.style.borderColor = "rgba(26,37,64,0.15)")}
              />
              {errors.email && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => field("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
                  style={inputStyle(!!errors.password)}
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
              {form.password && (
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
                    <span style={{ fontSize: "0.72rem", color: strength.color, fontWeight: 500 }}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
              {errors.password && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label style={{ color: "#1a2540", fontSize: "0.82rem", fontWeight: 500 }}>Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => field("confirmPassword", e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
                  style={inputStyle(!!errors.confirmPassword)}
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
              {errors.confirmPassword && <p style={{ color: "#d4183d", fontSize: "0.75rem" }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors mt-0.5"
                style={{
                  background: agreed ? "#1a2540" : "#ffffff",
                  border: `1px solid ${errors.agreed ? "#d4183d" : agreed ? "#1a2540" : "rgba(26,37,64,0.25)"}`,
                  cursor: "pointer",
                }}
              >
                {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
              </button>
              <p style={{ color: "#6b7694", fontSize: "0.8rem", lineHeight: 1.5 }}>
                I agree to the{" "}
                <span style={{ color: "#2f54eb", cursor: "pointer" }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color: "#2f54eb", cursor: "pointer" }}>Privacy Policy</span>
              </p>
            </div>
            {errors.agreed && <p style={{ color: "#d4183d", fontSize: "0.75rem", marginTop: "-8px" }}>{errors.agreed}</p>}

            {error && (
              <p style={{ color: "#d4183d", fontSize: "0.82rem", background: "rgba(212,24,61,0.06)", padding: "0.6rem 0.9rem", borderRadius: "0.4rem", textAlign:"center" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-opacity mt-1"
              style={{
                background: "#2f54eb",
                color: "#ffffff",
                fontWeight: 500,
                fontSize: "0.9rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span>Creating account…</span>
              ) : (
                <>
                  <span>Create free account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(26,37,64,0.1)" }} />
              <span style={{ color: "#6b7694", fontSize: "0.78rem" }}>or sign up with</span>
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
              Continue with Google
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#6b7694", fontSize: "0.85rem", marginTop: "1.75rem" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={()=>router.push('/login')}
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
