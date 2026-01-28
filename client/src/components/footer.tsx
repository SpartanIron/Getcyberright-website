import { Mail, MapPin, Globe } from "lucide-react";
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
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="footer-link-logo">
              <img src={logoImage} alt="GetCyberRight" className="w-10 h-10 object-contain" />
              <span className="font-semibold text-lg text-foreground">
                GetCyberRight
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-sm">
              Free cyber protection for every family member. We make online safety simple with free tools and plain-language guides. No signup required.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4" />
              <span>Based in the United States</span>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground transition-colors hover-elevate"
                  aria-label={social.name}
                  data-testid={`social-link-${social.name.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For You</h4>
            <ul className="space-y-2">
              {footerLinks.forYou.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Free Tools</h4>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="font-medium">Trusted Sources:</span>
              {trustedSources.map((source) => (
                <a
                  key={source.name}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {source.name}
                </a>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@getcyberright.com" className="hover:text-foreground transition-colors" data-testid="text-contact-email">
                    support@getcyberright.com
                  </a>
                </div>
                <span className="hidden sm:inline text-muted-foreground/50">|</span>
                <a href="mailto:partnerships@getcyberright.com" className="hover:text-foreground transition-colors" data-testid="text-partnerships-email">
                  Partnerships
                </a>
                <span className="hidden sm:inline text-muted-foreground/50">|</span>
                <a href="mailto:advertising@getcyberright.com" className="hover:text-foreground transition-colors" data-testid="text-advertising-email">
                  Advertising
                </a>
                <span className="hidden sm:inline text-muted-foreground/50">|</span>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span data-testid="text-users">Serving families in 50+ countries</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center" data-testid="text-copyright">
              &copy; {new Date().getFullYear()} GetCyberRight. All rights reserved. 100% Free Forever.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
