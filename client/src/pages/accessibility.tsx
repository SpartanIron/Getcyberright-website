import { Link } from "@/lib/navigation";
import { FadeIn } from "@/components/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
 Accessibility, 
 Eye, 
 Keyboard, 
 Monitor, 
 MessageSquare, 
 CheckCircle,
 Mail,
 ExternalLink
} from "lucide-react";

export default function AccessibilityPage() {

 const accessibilityFeatures = [
 {
 icon: Keyboard,
 title: "Keyboard Navigation",
 description: "Navigate the entire site using only your keyboard. Use Tab to move forward, Shift+Tab to move backward, and Enter to activate links and buttons."
 },
 {
 icon: Eye,
 title: "Screen Reader Support",
 description: "Our site is optimized for screen readers with proper ARIA labels, semantic HTML, and descriptive alt text for images."
 },
 {
 icon: Monitor,
 title: "Responsive Design",
 description: "Content adapts to all screen sizes and zoom levels up to 200% without loss of functionality or information."
 },
 {
 icon: Accessibility,
 title: "Color Contrast",
 description: "We maintain WCAG 2.1 AA compliant color contrast ratios to ensure text is readable for users with low vision or color blindness."
 }
 ];

 const shortcuts = [
 { keys: "Tab", action: "Move to next focusable element" },
 { keys: "Shift + Tab", action: "Move to previous focusable element" },
 { keys: "Enter / Space", action: "Activate buttons and links" },
 { keys: "Escape", action: "Close modals and dropdowns" },
 { keys: "Arrow Keys", action: "Navigate within menus and forms" },
 ];

 return (
 <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
 <section className="py-12 md:py-16 lg:py-20">
 <div className="container mx-auto px-4 max-w-4xl">
 <FadeIn
 className="text-center mb-12"
 >
 <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
 <Accessibility className="h-4 w-4" />
 Our Commitment
 </div>
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
 Accessibility Statement
 </h1>
 <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
 GetCyberRight is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone.
 </p>
 </FadeIn>

 <div className="space-y-8">
 <FadeIn
 >
 <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-xl">
 <CheckCircle className="h-5 w-5 text-teal-600" />
 Conformance Status
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <p className="text-slate-600 dark:text-slate-300">
 We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These guidelines explain how to make web content more accessible to people with disabilities.
 </p>
 <p className="text-slate-600 dark:text-slate-300">
 Our ongoing accessibility efforts include:
 </p>
 <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
 <li>Regular accessibility audits and testing</li>
 <li>Staff training on accessibility best practices</li>
 <li>Integration of accessibility into our development process</li>
 <li>User testing with assistive technology users</li>
 </ul>
 </CardContent>
 </Card>
 </FadeIn>

 <FadeIn
 >
 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
 Accessibility Features
 </h2>
 <div className="grid md:grid-cols-2 gap-4">
 {accessibilityFeatures.map((feature, index) => (
 <Card key={index} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
 <CardContent className="p-6">
 <div className="flex items-start gap-4">
 <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
 <feature.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
 </div>
 <div>
 <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
 {feature.title}
 </h3>
 <p className="text-sm text-slate-600 dark:text-slate-300">
 {feature.description}
 </p>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </FadeIn>

 <FadeIn
 >
 <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-xl">
 <Keyboard className="h-5 w-5 text-teal-600" />
 Keyboard Shortcuts
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-200 dark:border-slate-700">
 <th className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Keys</th>
 <th className="py-3 font-semibold text-slate-900 dark:text-white">Action</th>
 </tr>
 </thead>
 <tbody>
 {shortcuts.map((shortcut, index) => (
 <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
 <td className="py-3 pr-4">
 <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono text-slate-700 dark:text-slate-300">
 {shortcut.keys}
 </kbd>
 </td>
 <td className="py-3 text-slate-600 dark:text-slate-300">
 {shortcut.action}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 </FadeIn>

 <FadeIn
 >
 <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800">
 <CardContent className="p-6">
 <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
 <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-full">
 <MessageSquare className="h-6 w-6 text-teal-600 dark:text-teal-400" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
 Feedback & Assistance
 </h3>
 <p className="text-slate-600 dark:text-slate-300 mb-4">
 We welcome your feedback on the accessibility of GetCyberRight. If you encounter any barriers or need assistance, please contact us.
 </p>
 <div className="flex flex-wrap gap-3">
 <Button asChild className="bg-teal-600 hover:bg-teal-700">
 <Link to="/contact" className="flex items-center gap-2">
 <Mail className="h-4 w-4" />
 Contact Us
 </Link>
 </Button>
 <Button asChild variant="outline">
 <a 
 href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
 target="_blank" 
 rel="noopener noreferrer"
 className="flex items-center gap-2"
 >
 WCAG Guidelines
 <ExternalLink className="h-4 w-4" />
 </a>
 </Button>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </FadeIn>

 <FadeIn
 className="text-center text-sm text-slate-500 dark:text-slate-400"
 >
 <p>This statement was last updated on January 2026.</p>
 </FadeIn>
 </div>
 </div>
 </section>
 </div>
 );
}
