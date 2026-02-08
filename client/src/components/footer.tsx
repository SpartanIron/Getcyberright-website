<<<<<<< HEAD
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
=======
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Mail, MessageSquareHeart, Smartphone, ChevronDown, ChevronUp, Download } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { RegionSelector } from "@/components/region-selector";
import { type Region, detectUserRegion } from "@/lib/region-detect";
import { Button } from "@/components/ui/button";
import { UnifiedSubscribe } from "@/components/unified-subscribe";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function Footer() {
  const [userRegion, setUserRegion] = useState<Region>('global');
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    detectUserRegion().then(setUserRegion);
    
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  return (
    <footer className="bg-slate-900 text-slate-300" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}>GetCyberRight</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Based in the United States. Serving families around the world.
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@getcyberright.com" className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--cyber-blue)] transition-colors">
                <Mail className="h-5 w-5" />
                <span>hello@getcyberright.com</span>
              </a>
              <a href="https://www.linkedin.com/showcase/getcyberright" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0A66C2] transition-colors">
                <SiLinkedin className="h-5 w-5" />
                <span>Follow us on LinkedIn</span>
              </a>
              <Link to="/feedback" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors" data-testid="link-feedback">
                <MessageSquareHeart className="h-5 w-5" />
                <span>Share your feedback</span>
              </Link>
            </div>
          </div>
          
          {/* Family Protection */}
          <div>
            <h4 className="text-white font-semibold mb-4">Family Protection</h4>
            <ul className="space-y-3">
              <li><Link to="/start-here" className="hover:text-teal-400 transition-colors font-medium">Start Here</Link></li>
              <li><Link to="/youth-safety" className="hover:text-[var(--cyber-blue)] transition-colors">Youth Safety</Link></li>
              <li><Link to="/parent-guide" className="hover:text-[var(--cyber-blue)] transition-colors">Parent Guide</Link></li>
              <li><Link to="/senior-safety" className="hover:text-[var(--cyber-blue)] transition-colors">Senior Protection</Link></li>
              <li><Link to="/emergency-help" className="hover:text-red-400 transition-colors">Emergency Help</Link></li>
            </ul>
          </div>
          
          {/* Tools & Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tools & Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/scam-checker" className="hover:text-[var(--cyber-blue)] transition-colors">Scam Checker</Link></li>
              <li><Link to="/report-scam" className="hover:text-amber-400 transition-colors">Report a Scam</Link></li>
              <li><Link to="/quick-assessment" className="hover:text-[var(--cyber-blue)] transition-colors">Skill Check</Link></li>
              <li><Link to="/cyber-awareness" className="hover:text-[var(--cyber-blue)] transition-colors">Daily Tips</Link></li>
              <li><Link to="/news" className="hover:text-[var(--cyber-blue)] transition-colors">Latest News</Link></li>
              <li><Link to="/resources" className="hover:text-[var(--cyber-blue)] transition-colors">All Resources</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-[var(--cyber-blue)] transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--cyber-blue)] transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--cyber-blue)] transition-colors">FAQ</Link></li>
              <li><Link to="/advertise" className="hover:text-[var(--cyber-blue)] transition-colors">Advertise With Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[var(--cyber-blue)] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-[var(--cyber-blue)] transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-[var(--cyber-blue)] transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Add to Home Screen Guide */}
        <div className="border-t border-slate-700 pt-6 pb-4">
          <button 
            onClick={() => setShowInstallGuide(!showInstallGuide)}
            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-[var(--cyber-blue)] transition-colors text-sm"
          >
            <Smartphone className="h-4 w-4" />
            <span>Access Our Resources Faster</span>
            {showInstallGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showInstallGuide && (
            <div className="mt-4 text-sm text-slate-400 max-w-2xl mx-auto">
              <p className="text-center mb-4">
                Want quick access to cyber safety tips? You can add GetCyberRight directly to your phone's home screen so it works just like an app.
              </p>
              
              {/* Install Button - shows on supported browsers (Android Chrome) */}
              {installPrompt && !isInstalled && (
                <div className="flex justify-center mb-6">
                  <Button 
                    onClick={handleInstallClick}
                    className="bg-[var(--cyber-blue)] hover:bg-[var(--cyber-blue)]/90 text-white gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Install GetCyberRight App
                  </Button>
                </div>
              )}

              {isInstalled && (
                <div className="flex justify-center mb-6">
                  <p className="text-green-400 text-center">GetCyberRight is installed on your device!</p>
                </div>
              )}

              {/* Manual instructions as fallback */}
              {!installPrompt && !isInstalled && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-white font-medium mb-2">On iPhone (Safari):</h5>
                    <ol className="space-y-1 list-decimal list-inside text-slate-400">
                      <li>Tap the Share icon (square with an up arrow) at the bottom.</li>
                      <li>Scroll down and select "Add to Home Screen."</li>
                      <li>Tap "Add" in the top right corner.</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-medium mb-2">On Android (Chrome):</h5>
                    <ol className="space-y-1 list-decimal list-inside text-slate-400">
                      <li>Tap the three dots in the top right corner.</li>
                      <li>Select "Add to Home screen."</li>
                      <li>Tap "Add" to confirm.</li>
                    </ol>
                  </div>
                </div>
              )}
              
              <p className="text-center mt-4 text-[var(--cyber-blue)]">
                Now, expert safety advice is always just one tap away!
              </p>
            </div>
          )}
        </div>

        {/* Subscribe Section */}
        <div className="border-t border-slate-700 pt-8 pb-6">
          <div className="max-w-md mx-auto">
            <h4 className="text-white font-semibold mb-3 text-center">Stay Protected</h4>
            <p className="text-slate-400 text-sm text-center mb-4">Get cyber safety updates delivered to your inbox</p>
            <UnifiedSubscribe variant="footer" showTitle={false} />
          </div>
        </div>

        {/* Trusted Sources - Outbound Authority Links */}
        <div className="border-t border-slate-700 pt-6 pb-4">
          <p className="text-slate-500 text-xs mb-3 text-center">Trusted Sources</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="https://www.ic3.gov" target="_blank" rel="noopener" className="text-slate-500 hover:text-slate-300 transition-colors">FBI IC3</a>
            <a href="https://www.cisa.gov" target="_blank" rel="noopener" className="text-slate-500 hover:text-slate-300 transition-colors">CISA</a>
            <a href="https://www.interpol.int/Crimes/Cybercrime" target="_blank" rel="noopener" className="text-slate-500 hover:text-slate-300 transition-colors">INTERPOL</a>
            <a href="https://staysafeonline.org" target="_blank" rel="noopener" className="text-slate-500 hover:text-slate-300 transition-colors">StaySafeOnline</a>
            <a href="https://www.consumer.ftc.gov/features/scam-alerts" target="_blank" rel="noopener" className="text-slate-500 hover:text-slate-300 transition-colors">FTC Scam Alerts</a>
            <a href="https://www.aarp.org/money/scams-fraud" target="_blank" rel="noopener" className="text-slate-500 hover:text-slate-300 transition-colors">AARP Fraud Watch</a>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} GetCyberRight. A service platform powered by ColorCode Solutions LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <RegionSelector 
                currentRegion={userRegion} 
                onRegionChange={setUserRegion}
                variant="compact"
              />
              <div className="flex space-x-6">
                <Link to="/privacy-policy" className="text-slate-400 hover:text-[var(--cyber-blue)] text-sm transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-slate-400 hover:text-[var(--cyber-blue)] text-sm transition-colors">Terms of Service</Link>
                <Link to="/contact" className="text-slate-400 hover:text-[var(--cyber-blue)] text-sm transition-colors">Contact</Link>
              </div>
            </div>
          </div>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
        </div>
      </div>
    </footer>
  );
}
