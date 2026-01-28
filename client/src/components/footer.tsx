import { Mail, Phone, MapPin } from "lucide-react";
import { SiLinkedin, SiFacebook, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import logoImage from "@assets/image_(3)_1769558492356.png";

const footerLinks = {
  solutions: [
    { name: "For Families", href: "#solutions" },
    { name: "For Seniors", href: "#solutions" },
    { name: "For Small Business", href: "#solutions" },
    { name: "For Organizations", href: "#solutions" },
  ],
  resources: [
    { name: "Security Guides", href: "#resources" },
    { name: "Video Training", href: "#resources" },
    { name: "Scam Alerts", href: "#resources" },
    { name: "Checklists", href: "#resources" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Mission", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Careers", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: SiLinkedin, href: "#" },
  { name: "Facebook", icon: SiFacebook, href: "#" },
  { name: "YouTube", icon: SiYoutube, href: "#" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="footer-link-logo">
              <img src={logoImage} alt="GetCyberRight" className="w-10 h-10 object-contain" />
              <span className="font-semibold text-lg text-foreground">
                GetCyberRight
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Making cybersecurity accessible for families, seniors, and small
              businesses.
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
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span data-testid="text-contact-email">support@getcyberright.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span data-testid="text-contact-phone">1-800-CYBER-SAFE</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span data-testid="text-contact-address">123 Security Lane, Suite 100, Cybertown, CT 06001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} GetCyberRight. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors"
                data-testid={`footer-legal-${link.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
