'use client'
import { useState } from "react";
import { FileSignature, Menu, X, ChevronDown } from "lucide-react";



const navLinks = [
  {
    label: "Product",
    children: [
      { label: "Sign Documents", desc: "Draw, type, or upload signatures" },
      { label: "Request Signatures", desc: "Send docs to others for signing" },
      { label: "Audit Trail", desc: "Full timestamped signing history" },
    ],
  },
  { label: "Pricing" },
  { label: "Enterprise" },
  { label: "Blog" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage] = useState('login')

  const isAuth = ["login", "signup", "forgot-password", "verify-otp", "reset-password"].includes(currentPage);

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid rgba(26,37,64,0.1)",
        fontFamily: "'Inter', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2.5 flex-shrink-0"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#1a2540" }}
          >
            <FileSignature size={15} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontWeight: 700, color: "#0f1423", fontSize: "1rem", letterSpacing: "-0.02em" }}>
            Sign<span style={{ color: "#2f54eb" }}>PDF</span>
          </span>
        </button>

        {/* Desktop nav links */}
        {!isAuth && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5675", fontSize: "0.875rem", fontWeight: 500 }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setDropdownOpen(false)}
                  >
                    {link.label}
                    <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 w-64 rounded-xl py-2 shadow-lg"
                      style={{ background: "#ffffff", border: "1px solid rgba(26,37,64,0.1)", boxShadow: "0 8px 24px rgba(15,20,35,0.1)" }}
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {link.children.map((child) => (
                        <button
                          key={child.label}
                          type="button"
                          className="w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors"
                          style={{ background: "none", border: "none", cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f8fa")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          <span style={{ color: "#0f1423", fontSize: "0.85rem", fontWeight: 500 }}>{child.label}</span>
                          <span style={{ color: "#6b7694", fontSize: "0.78rem" }}>{child.desc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  className="px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5675", fontSize: "0.875rem", fontWeight: 500 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0f1423")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5675")}
                >
                  {link.label}
                </button>
              )
            )}
          </div>
        )}

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentPage === "login" || isAuth ? (
            <>
              <button
                type="button"
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#1a2540", fontSize: "0.875rem", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f2f8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                Sign in
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg flex items-center gap-1.5 transition-opacity"
                style={{ background: "#2f54eb", color: "#ffffff", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Get started free
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#1a2540", fontSize: "0.875rem", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f2f8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                Sign in
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg transition-opacity"
                style={{ background: "#1a2540", color: "#ffffff", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign up free
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: "none", border: "1px solid rgba(26,37,64,0.12)", cursor: "pointer", color: "#1a2540" }}
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-1"
          style={{ borderTop: "1px solid rgba(26,37,64,0.08)", background: "#ffffff" }}
        >
          {!isAuth && navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className="text-left px-3 py-3 rounded-lg"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5675", fontSize: "0.9rem", fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f8fa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {link.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(26,37,64,0.08)" }}>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg"
              style={{ background: "#f0f2f8", border: "none", cursor: "pointer", color: "#1a2540", fontSize: "0.9rem", fontWeight: 500 }}
            >
              Sign in
            </button>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg"
              style={{ background: "#2f54eb", border: "none", cursor: "pointer", color: "#ffffff", fontSize: "0.9rem", fontWeight: 500 }}
            >
              Get started free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
