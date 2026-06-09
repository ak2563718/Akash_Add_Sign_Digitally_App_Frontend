'use client'
import { FileSignature,   Mail } from "lucide-react";
import { FaTwitter,  FaGithub, FaLinkedin,} from 'react-icons/fa'

const footerLinks = [
  {
    heading: "Product",
    links: ["Sign Documents", "Request Signatures", "Audit Trail", "Templates", "Integrations"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"],
  },
  {
    heading: "Support",
    links: ["Help Center", "API Docs", "Status Page", "Community", "Changelog"],
  },
];

const socials = [
  { icon: FaTwitter, label: "FaTwitter" },
  { icon: FaGithub, label: "FaGithub" },
  { icon: FaLinkedin, label: "FaLinkedin" },
  { icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0f1423", fontFamily: "'Inter', sans-serif" }}>
     
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        {/* Top row: logo + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2f54eb" }}>
                <FileSignature size={15} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontWeight: 700, color: "#ffffff", fontSize: "1rem", letterSpacing: "-0.02em" }}>
                Sign<span style={{ color: "#2f54eb" }}>PDF</span>
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              The fastest way to sign, request, and manage PDF documents online.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(47,84,235,0.25)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ color: "#ffffff", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                {heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", padding: 0, textAlign: "left", transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
            © 2026 SignPDF Inc. All rights reserved.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {["SOC 2 Type II", "GDPR Compliant", "256-bit SSL", "ISO 27001"].map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
