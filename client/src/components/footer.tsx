import { Mail, Phone, MapPin } from "lucide-react";
import { SiLinkedin, SiFacebook, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import logoImage from "@assets/image_(3)_1769558492356.png";

const footerLinks = {
  solutions: [
    { name: "For Families", href: "/solutions#families" },
    { name: "For Seniors", href: "/solutions#seniors" },
    { name: "For Small Business", href: "/solutions#business" },
    { name: "For Educators", href: "/solutions#educators" },
  ],
  resources: [
    { name: "Security Guides", href: "/resources" },
    { name: "Free Tools", href: "/tools" },
    { name: "Scam Alerts", href: "/resources" },
    { name: "All Resources", href: "/resources" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: SiLinkedin, href: "https://www.linkedin.com/company/getcyberright" },
  { name: "Facebook", icon: SiFacebook, href: "https://www.facebook.com/getcyberright" },
  { name: "YouTube", icon: SiYoutube, href: "https://www.youtube.com/@getcyberright" },
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
              Making cybersecurity accessible for families, seniors, and small
              businesses. Free resources, no jargon.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
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
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
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

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
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
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span data-testid="text-contact-email">support@getcyberright.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span data-testid="text-contact-phone">1-800-CYBER-SAFE</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              &copy; {new Date().getFullYear()} GetCyberRight. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
