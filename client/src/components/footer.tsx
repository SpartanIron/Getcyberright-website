import { Mail, MapPin, Shield } from "lucide-react";
import { SiLinkedin, SiFacebook, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import logoImage from "@/assets/logo.png";

const footerLinks = {
  forYou: [
    { name: "Parents", href: "/parents" },
    { name: "Kids", href: "/kids" },
    { name: "Seniors", href: "/seniors" },
    { name: "Educators", href: "/educators" },
    { name: "Small Business", href: "/small-business" },
  ],
  tools: [
    { name: "Security Scanner", href: "/tools" },
    { name: "Data Broker Removal", href: "/data-removal" },
    { name: "Safety Toolkit", href: "/tools?tab=safety-toolkit" },
    { name: "Training Academy", href: "/training" },
    { name: "Resource Library", href: "/resources" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Pricing", href: "/pricing" },
    { name: "Emergency Help", href: "/emergency-help" },
    { name: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: SiLinkedin, href: "https://www.linkedin.com/company/getcyberright" },
  { name: "Facebook", icon: SiFacebook, href: "https://www.facebook.com/getcyberright" },
  { name: "YouTube", icon: SiYoutube, href: "https://www.youtube.com/@getcyberright" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="footer-link-logo">
              <img src={logoImage} alt="GetCyberRight" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-white">GetCyberRight</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Cyber protection resources for families and small businesses.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  aria-label={social.name}
                  data-testid={`social-link-${social.name.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
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
            <h4 className="font-semibold text-white text-sm mb-3">Tools & Learning</h4>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" aria-hidden="true" /> United States
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" aria-hidden="true" /> Free Tools Available
              </span>
              <span>Trusted by families in 50+ countries</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              <Link href="/partnerships" className="hover:text-white transition-colors">Partnerships</Link>
              <Link href="/advertising" className="hover:text-white transition-colors">Advertising</Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <p data-testid="text-copyright">
              &copy; {new Date().getFullYear()} GetCyberRight. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
              <span>Sources: FBI IC3, CISA, INTERPOL, FTC</span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
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
