import { Mail, MapPin, Globe, Shield, Heart } from "lucide-react";
import { SiLinkedin, SiFacebook, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import logoImage from "@/assets/logo.png";

const footerLinks = {
  forYou: [
    { name: "Parents Hub", href: "/parents" },
    { name: "Kids Hub", href: "/kids" },
    { name: "Seniors Hub", href: "/seniors" },
    { name: "Educators Hub", href: "/educators" },
    { name: "Small Business Hub", href: "/small-business" },
  ],
  tools: [
    { name: "Scam Checker", href: "/scam-checker" },
    { name: "Password Generator", href: "/password-generator" },
    { name: "Breach Checker", href: "/breach-checker" },
    { name: "All Tools", href: "/tools" },
  ],
  resources: [
    { name: "Security Guides", href: "/resources" },
    { name: "Emergency Help", href: "/emergency-help" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: SiLinkedin, href: "https://www.linkedin.com/company/getcyberright" },
  { name: "Facebook", icon: SiFacebook, href: "https://www.facebook.com/getcyberright" },
  { name: "YouTube", icon: SiYoutube, href: "https://www.youtube.com/@getcyberright" },
];

const trustedSources = [
  { name: "FBI IC3", href: "https://www.ic3.gov/" },
  { name: "CISA", href: "https://www.cisa.gov/" },
  { name: "INTERPOL", href: "https://www.interpol.int/" },
  { name: "FTC", href: "https://www.ftc.gov/" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6" data-testid="footer-link-logo">
              <img src={logoImage} alt="GetCyberRight" className="w-12 h-12 object-contain" />
              <span className="font-bold text-xl text-white">
                GetCyberRight
              </span>
            </Link>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Free cyber protection for every family member. We make online safety simple with free tools and plain-language guides.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Based in the United States</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Serving families in 50+ countries</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>100% Free Forever</span>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  aria-label={social.name}
                  data-testid={`social-link-${social.name.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">For You</h4>
            <ul className="space-y-3">
              {footerLinks.forYou.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Free Tools</h4>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@getcyberright.com" 
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                  data-testid="text-contact-email"
                >
                  Support
                </a>
              </li>
              <li>
                <a 
                  href="mailto:partnerships@getcyberright.com" 
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                  data-testid="text-partnerships-email"
                >
                  Partnerships
                </a>
              </li>
              <li>
                <a 
                  href="mailto:advertising@getcyberright.com" 
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                  data-testid="text-advertising-email"
                >
                  Advertising
                </a>
              </li>
              <li>
                <a 
                  href="mailto:press@getcyberright.com" 
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                  data-testid="text-press-email"
                >
                  Press Inquiries
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-slate-800">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Trusted Sources:</span>
              {trustedSources.map((source, index) => (
                <span key={source.name} className="flex items-center">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {source.name}
                  </a>
                  {index < trustedSources.length - 1 && (
                    <span className="mx-2 text-slate-600">|</span>
                  )}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400 flex items-center gap-1" data-testid="text-copyright">
                &copy; {new Date().getFullYear()} GetCyberRight. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for families everywhere.
              </p>
              
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
