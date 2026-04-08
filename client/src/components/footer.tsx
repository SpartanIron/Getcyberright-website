"use client";

import { Mail, Shield, Lock, FileCheck } from "lucide-react";
import { SiLinkedin, SiFacebook, SiYoutube, SiInstagram } from "react-icons/si";
import { Link } from "@/lib/navigation";
import logoImage from "@/assets/logo.webp";

const footerLinks = {
  learning: [
    { name: "Training Academy", href: "/training" },
    { name: "Awareness Hub", href: "/awareness-hub" },
    { name: "Cyber Safety Guides", href: "/guides" },
    { name: "AI Safety Guide", href: "/ai-safety" },
    { name: "AI Prompt Library", href: "/ai-prompts" },
    { name: "Scam Intelligence", href: "/scam-intel" },
    { name: "Cyber Threat Radar", href: "/cyber-threat-radar" },
    { name: "Resource Library", href: "/resources" },
  ],
  protection: [
    { name: "GCR Scam Guard", href: "/tools" },
    { name: "Browser Extension", href: "/browser-extension" },
    { name: "GCR Data Shield", href: "/shield" },
    { name: "Data Removal Center", href: "/data-removal" },
    { name: "Breach Monitor", href: "/breach-dashboard" },
    { name: "All Tools", href: "/tools" },
  ],
  forYou: [
    { name: "Parents & Families", href: "/parents" },
    { name: "Kids Safety", href: "/kids" },
    { name: "Seniors", href: "/seniors" },
    { name: "Small Business", href: "/small-business" },
    { name: "Educators", href: "/educators" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Our Mission", href: "/our-mission" },
    { name: "Emergency Help", href: "/emergency-help" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: SiLinkedin, href: "https://www.linkedin.com/company/getcyberright", color: "text-[#0A66C2]", hoverBg: "hover:bg-[#0A66C2]" },
  { name: "Facebook", icon: SiFacebook, href: "https://www.facebook.com/getcyberright", color: "text-[#1877F2]", hoverBg: "hover:bg-[#1877F2]" },
  { name: "Instagram", icon: SiInstagram, href: "https://www.instagram.com/getcyberright", color: "text-[#E4405F]", hoverBg: "hover:bg-[#E4405F]" },
  { name: "YouTube", icon: SiYoutube, href: "https://www.youtube.com/@getcyberright", color: "text-[#FF0000]", hoverBg: "hover:bg-[#FF0000]" },
];

export function Footer() {
  return (
    <footer className="bg-[#081C26] text-slate-300" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="footer-link-logo">
              <img src={logoImage} alt="GetCyberRight" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-white">GetCyberRight</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Protecting families from online scams, identity theft, and digital threats.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center ${social.color} hover:text-white ${social.hoverBg} transition-colors`}
                  aria-label={social.name}
                  data-testid={`social-link-${social.name.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Learning Hub</h4>
            <ul className="space-y-2">
              {footerLinks.learning.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Protection Hub</h4>
            <ul className="space-y-2">
              {footerLinks.protection.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">For You</h4>
            <ul className="space-y-2">
              {footerLinks.forYou.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6" data-testid="footer-compliance-badges">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              <span>OWASP Aligned</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FileCheck className="w-3.5 h-3.5" />
              <span>NIST Framework</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              <span>No Data Sold</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
            <p data-testid="text-copyright">
              &copy; {new Date().getFullYear()} GetCyberRight. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-slate-300 transition-colors">Support</Link>
              <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
              <button
                onClick={() => { localStorage.removeItem("gcr_cookie_consent"); window.dispatchEvent(new CustomEvent("cookie-consent-reopen", { detail: null })); }}
                className="hover:text-slate-300 transition-colors cursor-pointer"
                data-testid="link-cookie-settings"
              >
                Cookie Settings
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            <span>www.GetCyberRight.com is powered by </span>
            <a 
              href="https://colorcodesolutions.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              ColorCode Solutions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
